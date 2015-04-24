Template.navbar.onRendered(function() {
  this.resizeHandler = _.bind(function() {
    var navbarHeight = this.$(".navbar").outerHeight();
    $("body").css("paddingTop", navbarHeight + "px");
  }, this);
  //
  $(window).on("resize", this.resizeHandler);
  this.resizeHandler();
});

Template.navbar.onDestroyed(function() {
  $(window).off("resize", this.resizeHandler);
});
