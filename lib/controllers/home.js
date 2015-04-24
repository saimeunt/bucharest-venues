HomeController = MainLayoutController.extend({
  waitOn: function() {
    return [
      GoogleMapsAPI.load(),
      Meteor.subscribe("userQueries")
    ];
  },
  subscriptions: function() {
    return Meteor.subscribe("userVenues");
  },
  data: function() {
    var queries = Queries.find({
      userId: Meteor.userId()
    }, {
      sort: {
        date: 1
      }
    });
    //
    return {
      queries: queries
    };
  },
  onAfterAction: function() {
    var user = Meteor.user();
    if (user) {
      var queries = Queries.find({
        userId: Meteor.userId()
      }, {
        sort: {
          date: 1
        }
      }).fetch();
      var latestQuery = _.last(queries);
      var latestQueryId = latestQuery && latestQuery._id;
      this.state.set("currentQueryId", latestQueryId);
    } else {
      this.state.set("currentQueryId", null);
    }
  }
});
