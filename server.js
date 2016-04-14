var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var path = require('path');

var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var JWT_SECRET = 'themanwhosoldtheworld';

// var cookieParser = require('cookie-parser');

// Body Parser Setup
var bodyParser = require('body-parser');
app.use(bodyParser.json());


var port = process.env.PORT || 8080;


// Database Setup
// var db = require('./client/config/config.js');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/userRegistration');
// mongoose.connect(db.url); // connect to our database


var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var User = require('./server/models/userModel.js');
var Message = require('./server/models/messageModel.js');


//Requriements for Picture Upload
var multer = require('multer');
var crypto = require('crypto');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+ '/client/uploads/');
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});
var uploading = multer({ storage: storage });


//allow cors
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});



// Setup for Morgan
var logger = require('morgan');
app.use(logger('dev'));


// app.use('/', router);
app.use(express.static('client'));

//catchall route
app.get('/*', function(req, res){
  res.sendFile(process.cwd() +'/client/views/index.html');
});



//registration route
app.post('/users/register', function(req, res){

  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      var user = new User({
        email: req.body.email,
        password: hash,
        username: req.body.username
      });

      user.save(function(err){
        if (err) res.send(err);

        return res.send();
      })
    })
  })
})


//login route
app.put('/users/login', function(req, res, next){

  User.findOne({username: req.body.username}, function(err, user){
    bcrypt.compare(req.body.password, user.password, function(err, result){
      if (result){
        var token = jwt.encode(user, JWT_SECRET);
        return res.json({token : token});
      } else {
        return res.status(400).send();
      }
    })
  })
})

//route for img upload
app.post('/upload', uploading.single('image'), function(req, res) { 
  res.status(204).end(); 
});


// var bio = io.of('/bio');

io.on('connection', function(socket){


  var users = [];
  var username = '';
  var room = '';
  console.log('a user has connected');


  socket.on('join-room', function(data){
    socket.join(data.room);
    room = data.room;
  });


  socket.on('request-users', function(){
    socket.emit('users', {users: users});
  });

  socket.on('add-user', function(data){


    if(users.indexOf(data.username) == -1){
      io.to(room).emit('add-user', {
        username: data.username
      });
      username = data.username;
      users.push(data.username);
    } else {
      socket.emit('prompt-username', {
        message : "User already exists"
      });
    }
  });

  socket.on('message', function(data){
    console.log(data);
    io.to(room).emit('message', {username: username, message: data.message});

    var newMessage = new Message({message: data.message, username: username, created: Date.now()});
    console.log(newMessage);

    newMessage.save(function(err){
      if (err) throw err;
      console.log('new message saved');
     });
  });

  socket.on('disconnect', function(data){
    console.log(username + ' has disconnected');
    users.splice(users.indexOf(username), 1);
    io.to(room).emit('remove-user', {username: username});
  });
});




http.listen(port, function(){
  console.log("Magic on Port " + port);
});