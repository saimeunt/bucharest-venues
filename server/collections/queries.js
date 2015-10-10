Meteor.publish('userQueries', function userQueries() {
  return Queries.find({
    userId: this.userId,
  });
});

Picker.route('/queries/:_id/export-csv', (params, request, response,/* next*/) => {
  const query = Queries.findOne(params._id);
  const date = moment(query.date).format('YYYY-MM-DD');
  const filename = `${date}-${query._id}.csv`;
  response.writeHead(200, {
    'Content-type': 'text/csv',
    'Content-Disposition': `attachment; filename=${filename}`,
  });
  //
  const venues = Venues.find({
    queryId: query._id,
  }).fetch();
  //
  const csvString = csv.stringifySync(venues, {
    columns: {
      name: 'Name',
      city: 'City',
      address: 'Street Address',
      lat: 'Latitude',
      lng: 'Longitude',
    },
    header: true,
  });
  response.end(csvString);
});
