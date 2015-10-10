Queries = new Mongo.Collection('queries');

Meteor.methods({
  insertQuery(query) {
    check(query, {
      query: String,
      lat: Number,
      lng: Number,
      radius: Number,
      zoom: Number,
    });
    //
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Not logged in !');
    }
    //
    _.extend(query, {
      userId: this.userId,
      date: moment().toISOString(),
    });
    //
    const queryId = Queries.insert(query);
    //
    if (this.isSimulation) {
      return queryId;
    }
    //
    const result = HTTP.get('https://api.foursquare.com/v2/venues/explore', {
      params: {
        client_id: Meteor.settings.FOURSQUARE_CLIENT_ID,
        client_secret: Meteor.settings.FOURSQUARE_CLIENT_SECRET,
        query: query.query,
        ll: `${query.lat},${query.lng}`,
        radius: query.radius,
        v: '20130815',
      },
    });
    //
    const json = JSON.parse(result.content);
    //
    json.response.groups.forEach(group => {
      group.items.forEach(item => {
        const venue = _.pick(item.venue, 'name');
        _.extend(venue, _.pick(item.venue.location, ['city', 'address', 'lat', 'lng']));
        Venues.insertVenue(queryId, venue);
      });
    });
    //
    Queries.update(queryId, {
      $set: {
        suggestedBounds: json.response.suggestedBounds,
        ready: true,
      },
    });
    //
    return queryId;
  },
  removeQuery(queryId) {
    check(queryId, String);
    //
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Not logged in !');
    }
    //
    const query = Queries.findOne(queryId);
    if (!query) {
      throw new Meteor.Error('query-not-found', 'Query not found !');
    }
    if (this.userId !== query.userId) {
      throw new Meteor.Error('not-owner-of-query', 'Not owner of query !');
    }
    //
    Venues.find({
      queryId: queryId,
    }).forEach(venue => Venues.remove(venue._id));
    //
    return Queries.remove(queryId);
  },
});
