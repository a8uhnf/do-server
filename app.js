var express = require('express');
var app = express();
var morgan = require('morgan');
const bodyParser = require('body-parser');
var application_root = __dirname,
    path = require("path"),
    mongoose = require('mongoose');
app.use(morgan('combined'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
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
var User = mongoose.model('User', new mongoose.Schema({
  name: 'String',
  email: 'String',
  username: 'String',
  password: 'String'
}));
app.use(express.static(path.join(application_root, "public")));
app.post('/login', function (req, resp, next) {
  console.log('hello login');
  resp.send('okay');
});
app.post('/register', function (req, resp, next) {
  console.log('hello /register', req.body);
  resp.send('okay');
});
app.get('/hello', function (request, response, next) {
  // response.send("I'm hanifa");
  var todo;
  todo = new Todo({
    text: 'hanifa',
    done: 'everything',
    order: 'pizza'
  });
  todo.save(function(err) {
    if (!err) {
      return console.log("created");
    }
  });
  return response.send(todo);
});
app.post('/hello', function (request, response) {
  console.log('hello world', request.body);
  response.send("I'm hanifa");
});
app.get('/users', function (request, response, next) {

});
app.listen(3000);
