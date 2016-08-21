module.exports = function(app){
  var user = require('../controllers/users');
  app.get('/doctors', user.findAllUsers());
  // app.post('/register', musicians.findById);
  // app.post('/login', musicians.add);
}
