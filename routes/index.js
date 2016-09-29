/*
 * GET Home page
 */
var path = require('path');

exports.index = function (request, response) {
  // response.clearCookie('tkn');
  var lengthOfCookie = Object.keys(request.cookies).length;
  console.log(lengthOfCookie, 'hello world');
  if (Number(lengthOfCookie) === 0) {
    response.sendfile(path.join(__dirname + '/../public/dist/user-section/index.html'));
  } else {
    response.sendfile(path.join(__dirname + 'public/dist/doctor-section/index.html'));
  }
};
