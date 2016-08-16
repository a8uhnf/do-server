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
  var testUser = new User();
  if (User.find({username: req.body.username})) {
    console.log('User already exist', User.findOne({username: req.body.username}));
  } else {
    console.log('Unique user');
  }
  console.log('hello /register', req.body.name);
  resp.send('okay');
});
app.get('/users', function (request, response, next) {

});
app.listen(3000);
