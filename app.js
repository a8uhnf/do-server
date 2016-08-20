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
app.post('/register', function (req, resp, next) {
  User.find({}, function (err, user) {
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
      // .where('email').equals(req.body.email)
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
  });
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
