Template.home.onCreated(function homeCreated() {
  this.autorun(() => {
    this.subscribe('userQueries');
    this.subscribe('userVenues');
  });
});

Template.home.onRendered(function homeRendered() {
  this.autorun(() => {
    const user = Meteor.user();
    if (user) {
      const queries = Queries.find({
        userId: Meteor.userId(),
      }, {
        sort: {
          date: 1,
        },
      }).fetch();
      const latestQuery = _.last(queries);
      const latestQueryId = latestQuery && latestQuery._id;
      FlowRouter.setQueryParams({
        query: latestQueryId,
      });
    } else {
      FlowRouter.setQueryParams({
        query: null,
      });
    }
  });
});

Template.home.helpers({
  userQueries() {
    const queries = Queries.find({
      userId: Meteor.userId(),
    }, {
      sort: {
        date: 1,
      },
    });
    //
    return {
      queries,
    };
  },
});
