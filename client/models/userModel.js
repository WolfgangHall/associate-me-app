var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs')

  var db = mongoose.connection;

  db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
  });
  db.once('open', function() {
    console.log('Mongoose connection successful.');
  });

  var userSchema = new Schema({
    created: {
      type: Date,
      default: Date.now()
    },
    username : {
      type: String,
      trim: true,
      unique: true
    },
    firstName: String,
    lastName: String,
    email: String,
    password: String
  });

userSchema.pre("save", function(next){
  var user = this;

  //will only hash the password if it is new or has been modified
  if(!user.isModified("password")) return next();

  //salt generation
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    //hash password with salt
    bcrypt.hash(user.password, salt, function(err, hash) {

      //override cleartext password with hashed password
      user.password = hash;
      next();
    });
  });
});

var User = mongoose.model('User', userSchema);

module.exports = User;