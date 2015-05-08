function currentVenues() {
  var currentQueryId = Router.current().state.get("currentQueryId");
  return Venues.find({
    queryId: currentQueryId
  });
}

Template.venues.helpers({
  hasCurrentVenues: function() {
    return currentVenues().count() > 0;
  },
  currentVenuesCount: function() {
    function pluralize(count, label) {
      label += count == 1 ? "" : "s";
      return count + " " + label;
    }
    return pluralize(currentVenues().count(), "venue");
  },
  currentQuery: function() {
    var currentQueryId = Router.current().state.get("currentQueryId");
    return Queries.findOne(currentQueryId);
  }
});

Template.venuesTable.helpers({
  currentVenues: currentVenues,
  latFormatted: function() {
    return this.lat.toFixed(6);
  },
  lngFormatted: function() {
    return this.lng.toFixed(6);
  }
});
