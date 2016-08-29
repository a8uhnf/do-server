const Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.modal-content',
  SigninModal: 'modal/sign-in.html',
  events: {

  },
  initialize() {
    this.$el.html(global.nunjucksEnv.render(this.SigninModal));
  },
  render() {
    console.log('hello renderfunction modal');
  }
});
