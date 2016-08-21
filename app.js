var express = require('express');
var app = express();
var morgan = require('morgan');
const bodyParser = require('body-parser');
var User = require('./db/User');
var application_root = __dirname,
    path = require("path"),
    mongoose = require('mongoose');

app.use(morgan('combined'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/do_db');
var db = mongoose.connection;
db.on('error', function () {
  console.log('connection error');
});
db.once('open', function () {
  console.log('Db connected...');
});
app.use(express.static(path.join(application_root, "public")));
app.post('/login', function (req, resp, next) {
  resp.send('okay');
});

function checkUsername(username) {
  console.log('hello world check username');
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
  console.log('hello world check email');
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
  /*User.find({}, function (err, user) {
    if (err) {
      throw err;
    }
    console.log('hello world', user);
    if (Number(user.length) > 0) {
      resp.send('email and username already exist');
      next();
      resp.end('okay');
    }
  })
      .where('email').equals(req.body.email)
      .where('username').equals(req.body.username);

  User.find({ username: req.body.username }, function (err, user) {
    if (err) {
      resp.json({code: 1, status: 'error1', err: err});
      next();
    }
    if (Number(user.length) !== 0) {
      resp.send({status: {
        code: 0,
        message: 'username already exist'
      }});
      resp.end();
      next();
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        realname: req.body.name
      });
      newUser.save(function (err) {
        if (err) {
          // throw err;
          resp.json({code: 1, status: 'error1', err: err});
          next();
        }
      });
    }
  });*/
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
