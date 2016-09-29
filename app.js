var express = require('express');
var app = express();
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var path = require("path");
var application_root = __dirname;
var User = require('./db/User');
var mongoose = require('mongoose');
var db = mongoose.connection;
var _ = require('lodash');
var bcrypt = require('bcrypt');
var route = require('./routes');
app.use(morgan('dev'));

app.use(function(req, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Data-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost/do_db');

db.on('error', function (req, resp) {
  console.log('connection error');
  resp.send(':(');
});

db.once('open', function () {
  console.log('Db connected...');
});

function checkUsername(username) {
  return new Promise(function (resolve, reject) {
    User.find({ username: username }, function (err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

function checkEmail(email) {
  return new Promise(function (resolve, reject) {
    User.find({ email: email}, function (err, user) {
      if (err) {
        reject(err);
      } else {
        console.log('yes this the similar email users', user);
        resolve(user);
      }
    });
  });
}

function saveUser(userInfo) {

}

function generateSendMessage(message, code) {
  return {status: {
    code: code,
    message: message
  }};
}
app.use(express.static(path.join(application_root, "public/dist/")));
console.log(__dirname);

app.get('/', route.index);
app.get('/dc', function (request, response) {
  response.clearCookie('hello_world');
  response.clearCookie('tkn');
  if (typeof request.cookies === 'undefined') {
    response.sendfile('./public/dist/user-section/index.html', {root: __dirname});
  } else {
    response.sendfile('./public/dist/doctor-section/index.html', {root: __dirname});
  }
});

app.post('/register', function (req, response, next) {
  var reqBody;
  _.map(req.body, function (value, key) {
    reqBody = key;
  });
  reqBody = JSON.parse(reqBody);
  checkUsername(reqBody.username)
      .then(function (resp) {
        if (Number(resp.length) > 0) {
          response.send({status: {
            code: 2,
            message: 'username already exist'
          }});
        } else {
          checkEmail(reqBody.email)
              .then(function (res) {
                console.log('yes this is the users', res);
                if (Number(res.length) > 0) {
                  response.send({status: {
                    code: 2,
                    message: 'Email already exist'
                  }});
                } else {
                  // saveUser(reqBody);
                  var newUser = new User({
                    username: reqBody.username,
                    password: reqBody.password,
                    email: reqBody.email,
                    realname: reqBody.realname
                  });
                  newUser.save(function (err) {
                    if (err) throw err;
                    response.send({status: {
                      code: 0,
                      message: 'Success'
                    }});
                  });
                }
              });
        }
      });
});

app.post('/login', function (req, response) {
  var reqBody;
  _.map(req.body, (value, key)=> {
    reqBody = JSON.parse(key);
  });
  User.find({username: reqBody.username}, function (err, user) {
    if (err) throw err;
    if (user.username === reqBody.username){
      console.log('hello world', reqBody);
    }
    if (Number(user.length) === 0) {
      response.send({status: {
        code: 0,
        message: 'username not found'
      }});
    } else if (reqBody.username === user[0].username && reqBody.password === user[0].password) {
      var tkn = reqBody.username + ':' + reqBody.password;
      response.cookie('tkn', tkn).send(generateSendMessage('username and password matched', 0));
      // response.cookie('hello', 'world');
    } else {
      response.send(generateSendMessage('username and password not matched', 0));
    }
  });
  // response.send(generateSendMessage(''));
});
// Get all user list
app.get('/users', function (request, response, next) {
  User.find({}, function(err, users) {
    var userMap = {};
    users.forEach(function(user) {
      userMap[user._id] = user;
    });
    response.send(JSON.stringify(userMap, null, 3));
  });
});
app.listen(3000);
