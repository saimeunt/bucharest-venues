Template.map.onCreated(function mapCreated() {
  this.name = 'venuesMap';
  this.markers = {};
  //
  this.createMarker = (map, venue) => {
    const marker = new google.maps.Marker({
      map,
      position: new google.maps.LatLng(venue.lat, venue.lng),
      title: venue.name,
    });
    const infoWindow = new google.maps.InfoWindow({
      content: Blaze.toHTMLWithData(Template.venueAddress, venue),
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });
    google.maps.event.addListener(marker, 'visible_changed', () => {
      infoWindow.close();
    });
    return marker;
  };
});

Template.map.onRendered(function mapRendered() {
  this.autorun(() => {
    const map = GoogleMapsAPI.map(this.name);
    if (!map) {
      return;
    }
    //
    _.each(this.markers, marker => {
      marker.setVisible(false);
    });
    //
    const currentQueryId = FlowRouter.getQueryParam('query');
    const query = Queries.findOne(currentQueryId);
    const ready = query && query.ready;
    if (!ready) {
      return;
    }
    // set proper bounds
    /* const sw = new google.maps.LatLng(query.suggestedBounds.sw.lat, query.suggestedBounds.sw.lng);
    const ne = new google.maps.LatLng(query.suggestedBounds.ne.lat, query.suggestedBounds.ne.lng);
    const bounds = new google.maps.LatLngBounds(sw, ne);
    map.fitBounds(bounds);*/
    const center = new google.maps.LatLng(query.lat, query.lng);
    map.setCenter(center);
    map.setZoom(query.zoom);
    //
    Venues.find({
      queryId: currentQueryId,
    }).forEach(venue => {
      if (this.markers[venue._id]) {
        this.markers[venue._id].setVisible(true);
      } else {
        this.markers[venue._id] = this.createMarker(map, venue);
      }
    });
  });
});

Template.map.helpers({
  googleMapsOptions() {
    return {
      name: Template.instance().name,
      center: {
        lat: 44.4268,
        lng: 26.1025,
      },
    };
  },
});
