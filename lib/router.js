Router.route("/", {
  name: "home"
});

Router.route("/queries/:_id/export-csv", function() {
  exportQueryAsCSV(this.params._id, this.response);
}, {
  name: "queries-export-csv",
  where: "server"
});
