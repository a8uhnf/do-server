const Backbone = require('backbone');
const SignupFormView = require('../views/signup/signup-form-view');
const DashboardView = require('../views/home/dashboard-view');

module.exports = Backbone.Router.extend({
  constructor(options) {
    console.log('hello world', options);
    Backbone.Router.prototype.constructor.call(this, options);
  },
  routes: {
    '': 'dashboardRoute',
    'register': 'registryUser'
  },
  registryUser() {
    console.log('register user');
    this.firstView = new SignupFormView();
    this.firstView.render();
  },
  dashboardRoute() {
    console.log('hello world, this is dashborad route');
    this.firstView = new DashboardView();
    this.firstView.render();
  }
});
