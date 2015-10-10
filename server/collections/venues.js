Meteor.publish('userVenues', function userVenues() {
  return Venues.find({
    userId: this.userId,
  });
});

_.extend(Venues, {
  insertVenue(queryId, venue) {
    const query = Queries.findOne(queryId);
    //
    _.extend(venue, {
      userId: query.userId,
      queryId: query._id,
    });
    //
    return Venues.insert(venue);
  },
});
