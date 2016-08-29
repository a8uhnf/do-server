const Backbone = require('backbone');
const $ = require('jquery');
module.exports = Backbone.View.extend({
  el: '.modal-content',
  SigninModal: 'modal/sign-in.html',
  events: {
    'click #register-button': 'registerButton'
  },
  initialize() {
    this.$el.html(global.nunjucksEnv.render(this.SigninModal));
  },
  render() {
    console.log('hello renderfunction modal');
  },
  registerButton() {
    $('#docham-modal').modal('hide');
  }
});
