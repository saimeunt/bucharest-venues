Template.queries.helpers({
  hasQueries() {
    return this.queries.count() > 0;
  },
});

Template.queriesTable.helpers({
  latFormatted() {
    return this.lat.toFixed(6);
  },
  lngFormatted() {
    return this.lng.toFixed(6);
  },
  radiusFormatted() {
    const km = this.radius / 1000;
    const kmFixed = km.toFixed(1);
    return `${kmFixed}km`;
  },
  dateFormatted() {
    return moment(this.date).format('MMM Do, HH:mm');
  },
  active() {
    const currentQueryId = FlowRouter.getQueryParam('query');
    const active = currentQueryId === this._id;
    return active ? 'active' : '';
  },
});

Template.queriesTable.events({
  'click .js-remove-query'() {
    const currentQueryId = FlowRouter.getQueryParam('query');
    if (currentQueryId === this._id) {
      FlowRouter.setQueryParams({
        query: null,
      });
    }
    Meteor.call('removeQuery', this._id, error => {
      if (error) {
        console.log(error);
        return;
      }
    });
  },
  'click .js-select-row'() {
    FlowRouter.setQueryParams({
      query: this._id,
    });
  },
});

Template.queriesForm.onCreated(function queriesFormCreated() {
  this.getCurrentRadius = (map) => {
    const bounds = map.getBounds();
    const swPoint = bounds.getSouthWest();
    const nePoint = bounds.getNorthEast();
    //
    const distance = google.maps.geometry.spherical.computeDistanceBetween(swPoint, nePoint);
    const hypotenuse = distance / 2;
    return hypotenuse / 2;
  };
});

Template.queriesForm.events({
  'submit'(event, template) {
    event.preventDefault();
    //
    const map = GoogleMapsAPI.map('venuesMap');
    //
    const center = map.getCenter();
    const radius = template.getCurrentRadius(map);
    //
    const query = {
      query: template.$('[name="query"]').val(),
      lat: center.lat(),
      lng: center.lng(),
      radius,
      zoom: map.zoom,
    };
    //
    Meteor.call('insertQuery', query, (error, queryId) => {
      if (error) {
        console.log(error);
        return;
      }
      //
      FlowRouter.setQueryParams({
        query: queryId,
      });
    });
    //
    template.find('form').reset();
  },
});
