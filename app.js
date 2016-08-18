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
  console.log('hello login');
  resp.send('okay');
});
app.post('/register', function (req, resp, next) {
  // create a user a new user
  var testUser = new User({
    username: req.body.username,
    password: req.body.password,
    realname: req.body.realname,
    email: req.body.email,
  });

  testUser.save(function (err) {
    if (err) {
      throw err;
      resp.send('error 1');
    }

// fetch user and test password verification
    User.find({username: req.body.username}, function (err, user) {
      console.log('hello check user', user);
      if (err) {
        throw err;
        console.log('error occurs');
        resp.send('error 2');
      }
    });
  });
});
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
