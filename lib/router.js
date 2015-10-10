FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('mainLayout', {
      content: 'home',
    });
  },
});
