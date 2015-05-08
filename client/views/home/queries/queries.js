Template.queries.helpers({
  hasQueries: function() {
    return this.queries.count() > 0;
  }
});

Template.queriesTable.helpers({
  latFormatted: function() {
    return this.lat.toFixed(6);
  },
  lngFormatted: function() {
    return this.lng.toFixed(6);
  },
  radiusFormatted: function() {
    var km = this.radius / 1000;
    return km.toFixed(1) + "km";
  },
  dateFormatted: function() {
    return moment(this.date).format("MMM Do, HH:mm");
  },
  active: function() {
    var active = Router.current().state.equals("currentQueryId", this._id);
    return active ? "active" : "";
  }
});

Template.queriesTable.events({
  "click .js-remove-query": function() {
    if (Router.current().state.equals("currentQueryId", this._id)) {
      Router.current().state.set("currentQueryId", null);
    }
    Meteor.call("removeQuery", this._id, function(error) {
      if (error) {
        console.log(error);
        return;
      }
    });
  },
  "click .js-select-row": function() {
    Router.current().state.set("currentQueryId", this._id);
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

Template.queriesForm.events({
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
