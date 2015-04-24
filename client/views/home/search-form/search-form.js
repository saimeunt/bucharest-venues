Template.searchForm.helpers({
  disabled: function() {
    return !Meteor.userId();
  }
});

function getCurrentRadius(map) {
  var bounds = map.getBounds();
  var swPoint = bounds.getSouthWest();
  var nePoint = bounds.getNorthEast();
  //
  var distance = google.maps.geometry.spherical.computeDistanceBetween(swPoint, nePoint);
  var hypotenuse = distance / 2;
  return hypotenuse / 2;
}

Template.searchForm.events({
  "submit": function(event, template) {
    event.preventDefault();
    //
    var map = GoogleMapsAPI.map("venuesMap");
    //
    var center = map.getCenter();
    var radius = getCurrentRadius(map);
    //
    var query = {
      query: template.$("[name='query']").val(),
      lat: center.lat(),
      lng: center.lng(),
      radius: radius
    };
    //
    Meteor.call("insertQuery", query, function(error, queryId) {
      if (error) {
        console.log(error);
        return;
      }
      //
      Router.current().state.set("currentQueryId", queryId);
    });
    //
    template.find("form").reset();
  }
});
