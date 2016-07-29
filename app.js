var express = require('express');
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/hello', function (request, response, next) {
  console.log('hello world');
  response.send("I'm hanifa");
});
app.get('/users', function (request, response, next) {

});
app.listen(3000);
