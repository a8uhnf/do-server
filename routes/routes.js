module.exports = function(app){
  var musicians = require('./controllers');
  app.get('/doctors', musicians.findAll);
  app.post('/register', musicians.findById);
  app.post('/login', musicians.add);
}
