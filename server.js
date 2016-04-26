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
var mongoose = require('mongoose');
var db = require('./client/config/config.js');

// HEROKU DB
if(process.env.NODE_ENV === 'production'){
console.log(process.env.MONGOLAB_URI);
mongoose.connect(db.url); // connect to our database
}
else {
  // LOCAL DB
  console.log("connected locally");
  mongoose.connect('mongodb://localhost/userRegistration');
}




var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var User = require('./server/models/userModel.js');
var Message = require('./server/models/messageModel.js');
var Room = require('./server/models/rooms.js');


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




app.get('/loadRooms', function(req,res){
  Room.find({}, function (err, rooms) {
       res.json(rooms);
      });
    });

app.get('/chat/:room', function(req,res){
var theRoom = req.params.room;
console.log(Room.messages);
console.log(theRoom + 'in server');
Room.find({roomNameTrim : theRoom}, function (err, messages) {

  if (err){
    console.log(err);
  } else {

  
  console.log('i tired to find messages in room whatever it is');
  console.log('this is messages :' +  messages);

  res.json(messages);
}
// db.things.find( { ln : { $exists : true } } );
});
});

app.get('/usersRooms/:user', function(req,res){
var theUser= req.params.user;
console.log(theUser +'in server');
Room.find({moderator: theUser}, function (err, userRooms){
console.log('I tried to get the users rooms');
console.log(userRooms);
res.json(userRooms);

});

});





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
        username: req.body.username,
        userHash: req.body.userHash
      });
      console.log(user);

      user.save(function(err){
        if (err) res.send(err);

        return res.send();
      });
    });
  });
});

//create rooms route
app.post('/createRoom', function(req, res){
  var room = new Room({
    roomName: req.body.roomName,
    description: req.body.description,
    moderator: req.body.moderator,
    roomNameTrim: req.body.roomNameTrim

  });

  room.save(function(err){
    if (err) res.send(err);
    return res.send();
  });
});

//get rooms 



//login route
app.put('/users/login', function(req, res, next){

  User.findOne({username: req.body.username}, function(err, user){
    if(user){
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if (result){
          var token = jwt.encode(user, JWT_SECRET);
          return res.json({token : token, currentUserHash: user.userHash});
        } else {
          return res.status(404).json({error: 'Password not found'});
        }
      });
    } else {
      return res.status(404).json({error: 'User not found'});
    }
  });
});

//route for img upload
// app.post('/upload', uploading.single('image'), function(req, res) { 
//   res.status(204).end(); 
// });

app.delete('/deleteRoom/:roomId', function(req, res){
  Room.remove({_id:req.params.roomId}, function(err, rmRoom){
  });
});







var users = [];

  
io.on('connection', function(socket){

  var username = '';
  var room = '';

  console.log('a user has connected');


  socket.on('join-room', function(data){
    socket.join(data.room);
    room = data.room;
  });


  socket.on('request-users', function(){
    socket.to(room).emit('users', {users: users});
    console.log(users);
  });

  socket.on('add-user', function(data){

      io.to(room).emit('add-user', {
        username: data.username
      });
      username = data.username;
      users.push(data.username);
  });

  socket.on('message', function(data){
    console.log(data);
    io.to(room).emit('message', {username: username, message: data.message, room:room});

    var newMessage = new Message({message: data.message, username: username, created: Date.now(), room:room});
    console.log(data + ' thats data m80 ');
    console.log(newMessage);

    newMessage.save(function(err){
      if (err){ 
        throw err;
      } else {
      

      Room.findOneAndUpdate({roomNameTrim:room}, {$push: {'messages': data.message}}, {new:true}, function(err, dbRoom){
        // console.log(roomTrim);
        // console.log(Room.roomName);
        // console.log(roomName);
        console.log(data.message);
        console.log(room);
        if (err) {
          console.log(err);
        } else {
          console.log('i did something');
          console.log(dbRoom);
          return dbRoom;
        }

        //   res.send(err);
        // } else {
        //   res.send(dbRoom);
        // }
        });
      }
      
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