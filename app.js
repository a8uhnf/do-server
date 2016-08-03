var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var application_root = __dirname,
    path = require("path"),
    mongoose = require('mongoose');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/my_database');
var Todo = mongoose.model('Todo', new mongoose.Schema({
  text: String,
  done: Boolean,
  order: Number
}));
app.use(express.static(path.join(application_root, "public")));

/*app.configure(function(){
 app.use(express.bodyParser());
 app.use(express.methodOverride());
 app.use(app.router);

 app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
 //app.set('views', path.join(application_root, "views"));
 //app.set('view engine', 'jade')
 });*/
app.get('/hello', function (request, response, next) {
  console.log('hello world');
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
