Template.venues.onCreated(function venuesCreated() {
  this.currentVenues = () => {
    const currentQueryId = FlowRouter.getQueryParam('query');
    return Venues.find({
      queryId: currentQueryId,
    });
  };
});

Template.venues.helpers({
  hasCurrentVenues() {
    return Template.instance().currentVenues().count() > 0;
  },
  currentVenuesCount() {
    function pluralize(count, label) {
      const plural = count === 1 ? '' : 's';
      return `${count} ${label}${plural}`;
    }
    const currentVenuesCount = Template.instance().currentVenues().count();
    return pluralize(currentVenuesCount, 'venue');
  },
  exportUrl() {
    const currentQueryId = FlowRouter.getQueryParam('query');
    return `/queries/${currentQueryId}/export-csv`;
  },
});

Template.venuesTable.onCreated(function venuesTableCreated() {
  this.venues = this.view.parentView.parentView._templateInstance;
});

Template.venuesTable.helpers({
  currentVenues() {
    return Template.instance().venues.currentVenues();
  },
  latFormatted() {
    return this.lat.toFixed(6);
  },
  lngFormatted() {
    return this.lng.toFixed(6);
  },
});
