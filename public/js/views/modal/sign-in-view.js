const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('lodash');
module.exports = Backbone.View.extend({
  el: '.modal-content',
  SigninModal: 'modal/sign-in.html',
  events: {
    'click #register-button': 'registerButton',
    'click #login-button': 'loginButton'
  },
  initialize() {
    this.$el.html(global.nunjucksEnv.render(this.SigninModal));
  },
  render() {
    console.log('hello renderfunction modal');
  },
  loginButton() {
    const data = this.generateData();
    const url = '/login';
    global.ajaxCall({url: url, data: data, request: 'POST'})
        .then((resp)=> {
          console.log('hello resp', resp);
          if (Number(resp.status.code) === 0) {
            $('#docham-modal').modal('hide');
            global.router.navigate('/');
            location.reload();
          }
        });
  },
  generateData() {
    const data = {};
    _.each($('#sign-in-form').serializeArray(), function(it) {
      data[it.name] = it.value;
    });
    return data;
  },
  registerButton() {
    $('#docham-modal').modal('hide');
  },
  close() {
    this.unbind();
    this.undelegateEvents();
  }
});
