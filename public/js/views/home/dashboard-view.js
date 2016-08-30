const Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.main',
  SignupFormNunj: 'dashboard-nunj.html',
  events: {
    'click #dashboard-area': 'selectDashboardArea',
    'click #do-search': 'doSearch',
    'click #location-detect': 'detectLocation'
  },
  initialize() {
    this.url = 'http://127.0.0.1:3000/hello';
    this.$el.html(global.nunjucksEnv.render(this.SignupFormNunj));
  },
  selectDashboardArea(e) {
    e.preventDefault();
    debugger;
  },
  render() {
    // console.log('hello renderfunction');
  },
  doSearch() {
    console.log('hello doSearch');
  },
  detectLocation() {
    console.log('hello detectLocation');
    const apiKey = 'AIzaSyAit6-mcjjVYwRtoutwwQSweh_GfInYXaI';
    global.ajaxCall({url: 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + apiKey, request: 'POST', data: {}})
        .then((res)=> {
          console.log('google api response', res);
        });
  }
});
