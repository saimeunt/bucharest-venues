Meteor.publish("userQueries", function() {
  return Queries.find({
    userId: this.userId
  });
});

exportQueryAsCSV = function(queryId, response) {
  var query = Queries.findOne(queryId);
  //
  var filename = moment(query.date).format("YYYY-MM-DD") + "-" + query._id + ".csv";
  response.setHeader("Content-Disposition", "attachment; filename=" + filename);
  //
  var venues = Venues.find({
    queryId: query._id
  }).fetch();
  //
  var csvString = csv.stringifySync(venues, {
    columns: {
      name: "Name",
      city: "City",
      address: "Street Address",
      lat: "Latitude",
      lng: "Longitude"
    },
    header: true
  });
  response.end(csvString);
};
