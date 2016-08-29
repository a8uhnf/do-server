const Backbone = require('backbone');
const $ = require('jquery');
const RSVP = require('rsvp');

module.exports = Backbone.View.extend({
  el: '',
  initialize() {
    // console.log('hello iniitalize fucntion', options);
    // this.$el.html(global.nunjucksEnv.render(this.SignupFormNunj));
  },
  render(options) {
    this.url = options.url;
    this.data = options.data;
  },
  getRequest() {
    const that = this;
    console.log('hello url', that.url);
    return new RSVP.Promise((resolve, reject)=> {
      $.ajax({
        url: that.url,
        type: 'GET',
        dataType: 'json',
        success(result) {
          console.log('hello ajaxcall', result);
          resolve(result);
        },
        error(response) {
          reject(response);
        }
      });
    });
  },
  postRequest() {
    const that = this;
    console.log('hello url and data', that.url, that.data);
    return new RSVP.Promise((resolve, reject)=> {
      $.ajax({
        url: that.url,
        data: JSON.stringify(that.data),
        type: 'POST',
        dataType: 'json',
        success(result) {
          console.log('hello ajaxcall', result);
          resolve(result);
        },
        error(response) {
          reject(response);
        }
      });
    });
  }
});
