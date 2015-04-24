Template.map.onCreated(function() {
  this.name = "venuesMap";
  this.markers = {};
});

function createMarker(map, venue) {
  var marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(venue.lat, venue.lng),
    title: venue.name
  });
  var content = Blaze.toHTMLWithData(Template.venueAddress, venue);
  var infoWindow = new google.maps.InfoWindow({
    content: content
  });
  google.maps.event.addListener(marker, "click", function() {
    infoWindow.open(map, marker);
  });
  google.maps.event.addListener(marker, "visible_changed", function() {
    infoWindow.close();
  });
  return marker;
}

Template.map.onRendered(function() {
  this.autorun(function() {
    var map = GoogleMapsAPI.map(this.name);
    if (!map) {
      return;
    }
    //
    _.each(this.markers, function(marker) {
      marker.setVisible(false);
    });
    //
    var currentQueryId = Router.current().state.get("currentQueryId");
    var query = Queries.findOne(currentQueryId);
    var ready = query && query.ready;
    if (!ready) {
      return;
    }
    // set proper bounds
    var sw = new google.maps.LatLng(query.suggestedBounds.sw.lat, query.suggestedBounds.sw.lng);
    var ne = new google.maps.LatLng(query.suggestedBounds.ne.lat, query.suggestedBounds.ne.lng);
    var bounds = new google.maps.LatLngBounds(sw, ne);
    map.fitBounds(bounds);
    //
    Venues.find({
      queryId: currentQueryId
    }).forEach(function(venue) {
      if (this.markers[venue._id]) {
        this.markers[venue._id].setVisible(true);
      } else {
        this.markers[venue._id] = createMarker(map, venue);
      }
    }.bind(this));
  }.bind(this));
});

Template.map.helpers({
  googleMapsOptions: function() {
    return {
      name: Template.instance().name,
      center: {
        lat: 44.4268,
        lng: 26.1025
      }
    };
  }
});
