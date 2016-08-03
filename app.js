var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.get('/hello', function (request, response, next) {
  console.log('hello world');
  response.send("I'm hanifa");
});
app.post('/hello', function (request, response) {
  console.log('hello world', request.body);
  response.send("I'm hanifa");
});
app.get('/users', function (request, response, next) {

});
app.listen(3000);
