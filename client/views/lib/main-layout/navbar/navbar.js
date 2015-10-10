/* Template.navbar.onRendered(function() {
  this.resizeHandler = _.bind(function() {
    var navbarHeight = this.$('.navbar').outerHeight();
    $('body').css('paddingTop', navbarHeight + 'px');
  }, this);
  //
  $(window).on('resize', this.resizeHandler);
  this.resizeHandler();
});

Template.navbar.onDestroyed(function() {
  $(window).off('resize', this.resizeHandler);
});*/

Template.userMenu.helpers({
  disabled() {
    const disabled = !Accounts.loginServicesConfigured();
    return disabled ? 'disabled' : '';
  },
});

Template.userMenu.events({
  'click .js-login'() {
    Meteor.loginWithGoogle(error => {
      if (error) {
        console.log(error);
      }
    });
  },
  'click .js-logout'() {
    Meteor.logout(error => {
      if (error) {
        console.log(error);
      }
    });
  },
});
