var express = require('express');
var app = express();

app.get('/hello', function (request, response, next) {
  console.log('hello world');
  response.send("I'm hanifa");
});
app.get('/users', function (request, response, next) {

});
app.listen(3000);
