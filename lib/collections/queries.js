Queries = new Mongo.Collection("queries");

Meteor.methods({
  insertQuery: function(query) {
    check(query, {
      query: String,
      lat: Number,
      lng: Number,
      radius: Number
    });
    //
    if (!this.userId) {
      throw new Meteor.Error(500, "Not logged in !");
    }
    //
    _.extend(query, {
      userId: this.userId,
      date: moment().toISOString()
    });
    //
    var queryId = Queries.insert(query);
    //
    if (this.isSimulation) {
      return queryId;
    }
    //
    var result = HTTP.get("https://api.foursquare.com/v2/venues/explore", {
      params: {
        client_id: Meteor.settings.FOURSQUARE_CLIENT_ID,
        client_secret: Meteor.settings.FOURSQUARE_CLIENT_SECRET,
        query: query.query,
        ll: query.lat + "," + query.lng,
        radius: query.radius,
        v: "20130815"
      }
    });
    //
    var json = JSON.parse(result.content);
    //
    var aggregatedVenues = [];
    json.response.groups.forEach(function(group) {
      group.items.forEach(function(item) {
        var venue = _.pick(item.venue, "name");
        _.extend(venue, _.pick(item.venue.location, ["city", "address", "lat", "lng"]));
        insertVenue(queryId, venue);
      });
    });
    //
    Queries.update(queryId, {
      $set: {
        suggestedBounds: json.response.suggestedBounds,
        ready: true
      }
    });
    //
    return queryId;
  },
  removeQuery: function(queryId) {
    check(queryId, String);
    //
    if (!this.userId) {
      throw new Meteor.Error(500, "Not logged in !");
    }
    //
    var query = Queries.findOne(queryId);
    if (!query) {
      throw new Meteor.Error(500, "Query not found !");
    }
    if (this.userId != query.userId) {
      throw new Meteor.Error(500, "Not owner of query !");
    }
    //
    Venues.find({
      queryId: queryId
    }).forEach(function(venue) {
      Venues.remove(venue._id);
    });
    //
    return Queries.remove(queryId);
  }
});
