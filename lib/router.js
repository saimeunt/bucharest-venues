Router.route("/", {
  name: "home"
});

Router.route("/queries/:_id/export-csv", {
  name: "queries-export-csv",
  where: "server"
}).get(function() {
  exportQueryAsCSV(this.params._id, this.response);
});
