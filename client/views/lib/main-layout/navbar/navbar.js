/*Template.navbar.onRendered(function() {
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
});*/

Template.userMenu.helpers({
  disabled: function() {
    var disabled = !Accounts.loginServicesConfigured();
    return disabled ? "disabled" : "";
  }
});

Template.userMenu.events({
  "click .js-login": function() {
    Meteor.loginWithGoogle(function(error) {
      if (error) {
        console.log(error);
      }
    });
  },
  "click .js-logout": function() {
    Meteor.logout(function(error) {
      if (error) {
        console.log(error);
      }
    });
  }
});
