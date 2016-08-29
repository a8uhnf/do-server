const Backbone = require('backbone');
const $ = require('jquery');
const RSVP = require('rsvp');
// VIEWS
const HeaderMainView = require('./views/header/main-view');
// Router
const Router = require('./router/router');
// commonJS section
const AjaxCall = require('./commonjs/ajaxCall');
global.router = new Router({name: 'hello world'});
global.nunjucksEnv = new global.nunjucks.Environment(new global.nunjucks.PrecompiledLoader());
const ajaxCall = new AjaxCall();
global.headerMainView = new HeaderMainView();
global.headerView = ()=> {
  global.headerMainView.render();
};

global.locationAjaxCall = (url)=> {
  return new RSVP.Promise((resolve, reject)=> {
    $.ajax({
      url: url,
      type: 'POST',
      success(result) {
        console.log('hello ajaxcall', result);
        resolve(result);
      },
      error(response) {
        reject(response);
      }
    });
  });
};
global.ajaxCall = (options)=> {
  ajaxCall.render(options);
  if (options.request === 'GET') {
    return ajaxCall.getRequest();
  } else if (options.request === 'POST') {
    return ajaxCall.postRequest();
  }
};

Backbone.history.start();
