var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/do_db');
var db = mongoose.connection;

db.on('error', function () {
  console.log('db connection error');
});
