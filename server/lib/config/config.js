// Google service configuration
ServiceConfiguration.configurations.upsert({
  service: 'google',
}, {
  service: 'google',
  clientId: Meteor.settings.GOOGLE_CLIENT_ID,
  secret: Meteor.settings.GOOGLE_CLIENT_SECRET,
  loginStyle: 'popup', // BUG !!!
});
