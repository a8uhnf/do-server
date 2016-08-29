var express = require('express');
var app = express();
var morgan = require('morgan');
const bodyParser = require('body-parser');
var User = require('./db/User');
var application_root = __dirname;
var path = require("path");
var mongoose = require('mongoose');
var db = mongoose.connection;

app.use(morgan('combined'));

app.use(function(req, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/do_db');

db.on('error', function (req, resp) {
  console.log('connection error');
  resp.send(':(');
});

db.once('open', function () {
  console.log('Db connected...');
});

app.use(express.static(path.join(application_root, "public")));

function checkUsername(username) {
  return new Promise(function (resolve, reject) {
    User.find({ username: username }, function (err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

function checkEmail(email) {
  return new Promise(function (resolve, reject) {
    User.find({ email: email}, function (err, user) {
      if (err) {
        reject(err);
      } else {
        console.log('yes this the similar email users', user);
        resolve(user);
      }
    });
  });
}

function saveUser(user) {
  var newUser = new User({
    username: user.username,
    password: user.password,
    email: user.email,
    realname: user.name
  });
  return new Promise(function (resolve, reject) {
    newUser.save(function (err, usr) {
      if (err) {
        reject(err);
      } else {
        resolve(usr);
      }
    });
  });
}
app.post('/register', function (req, response, next) {
  checkUsername(req.body.username)
      .then(function (resp) {
        if (Number(resp.length) > 0) {
          response.send({status: {
            code: 0,
            message: 'username already exist'
          }});
        } else {
          checkEmail(req.body.email)
              .then(function (res) {
                console.log('yes this is the users', res);
                if (Number(res.length) > 0) {
                  response.send({status: {
                    code: 0,
                    message: 'Email already exist'
                  }});
                } else {
                  saveUser(req.body)
                      .then(function (respss) {
                        console.log('hello new user', respss);
                        response.send({status: {
                          code: 0,
                          message: 'Successfully saved user'
                        }});
                      });
                }
              });
        }
      });
});

app.post('/login', function (req, resp, next) {

});
// Get all user list
app.get('/users', function (request, response, next) {
  User.find({}, function(err, users) {
    var userMap = {};
    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    response.send(userMap);
  });
});
app.listen(3000);
