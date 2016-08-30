const Backbone = require('backbone');
// View
const SignInViewModal = require('../modal/sign-in-view');

module.exports = Backbone.View.extend({
  el: '.navbar',
  DashboardNunj: 'header-nunj.html',
  events: {
    'click #login-register': 'logInRegister'
  },
  initialize() {
    this.url = 'http://127.0.0.1:3000/hello';
    this.$el.html(global.nunjucksEnv.render(this.DashboardNunj));
  },
  logInRegister(e) {
    e.preventDefault();
    console.log('he;;p login/register');
    if (typeof this.modal !== 'undefined') {
      this.modal.close();
    }
    this.modal = new SignInViewModal();
    this.modal.render();
  },
  render() {
    // console.log('hello renderfunction');
  }
});
