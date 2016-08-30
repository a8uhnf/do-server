var User = require('../db/User');

// var user = new User();

exports.findAllUsers = function () {
  User.find({}, function (err, users) {
    console.log('hello users', users);
    return users;
  });
};