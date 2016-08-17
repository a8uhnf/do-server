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
    password: req.body.password
  });

  testUser.save(function (err) {
    if (err) {
      console.log('error occurs');
      resp.send('error 1');
    }

// fetch user and test password verification
    User.findOne({username: req.body.username}, function (err, user) {
      if (err) {
        console.log('error occurs');
        resp.send('error 2');
      }

      // test a matching password
      user.compareUsername('Password123', function (err, isMatch) {
        if (err) {
          console.log('error occurs');
          resp.send('error 3');
        }
        console.log('Password123:', isMatch); // -&gt; Password123: true
      });

      // test a failing password
      user.compareUsername('123Password', function (err, isMatch) {
        if (err) {
          console.log('error occurs');
          resp.send('error 4');
        }
        console.log('123Password:', isMatch); // -&gt; 123Password: false
      });
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
