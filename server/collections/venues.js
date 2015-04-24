Meteor.publish("userVenues", function() {
  return Venues.find({
    userId: this.userId
  });
});

insertVenue = function(queryId, venue) {
  var query = Queries.findOne(queryId);
  //
  _.extend(venue, {
    userId: query.userId,
    queryId: query._id
  });
  //
  return Venues.insert(venue);
};
