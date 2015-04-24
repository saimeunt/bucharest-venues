Template.queries.helpers({
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
    return moment(this.date).format("MMM D HH:mm");
  },
  success: function() {
    var success = Router.current().state.equals("currentQueryId", this._id);
    return success ? "success" : "";
  }
});

Template.queries.events({
  "click .remove-query-button": function() {
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
  "click tr": function() {
    Router.current().state.set("currentQueryId", this._id);
  }
});
