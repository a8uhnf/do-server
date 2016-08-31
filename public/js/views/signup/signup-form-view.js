const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('lodash');
module.exports = Backbone.View.extend({
  el: '.main',
  SignupFormNunj: 'signup-form-nunj.html',
  DoctorRegisterFormNunj: 'doctor-register-form-nunj.html',
  events: {
    'click .register-cancel': 'cancelRegisterForm',
    'click .register-doctor': 'registerDoctor'
  },
  initialize() {
    this.$el.html(global.nunjucksEnv.render(this.DoctorRegisterFormNunj));
  },
  cancelRegisterForm() {
    global.router.navigate('#');
  },
  registerDoctor(e) {
    e.preventDefault();
    const url = '/register';
    const data = this.generateData();
    console.log('hello url and data', url, data);
    global.ajaxCall({url: url, data: data, request: 'POST'})
        .then((response)=> {
          console.log('hello response', response);
        });
  },
  generateData() {
    const data = {};
    const formData = $('#doctor-register-form').serializeArray();
    _.each(formData, (it)=> {
      data[it.name] = it.value;
    });
    return data;
  },
  render() {
    // console.log('hello renderfunction');
  }
});
