const Backbone = require('backbone');
// const $ = require('jquery');
// const _ = require('lodash');
module.exports = Backbone.View.extend({
  el: '.side-bar',
  SidebarPatientNunj: 'sidebar-patient-nunj.html',
  events: {
  },
  initialize() {
    this.$el.html(global.nunjucksEnv.render(this.SidebarPatientNunj));
  },
  render() {
    console.log('hello sidebar render function');
  },
  close() {
    this.unbind();
    this.undelegateEvents();
  }
});
