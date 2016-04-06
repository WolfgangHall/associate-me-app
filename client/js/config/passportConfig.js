var LocalStrategy   = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/client/models/userModel.js');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

      // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log('serializing user:', user._id);
    //return the unique id for the user
    return done(null, user._id);
  });

  //Desieralize user will call with the unique id provided by serializeuser
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err,user){
      if(err){
        return done(err,false);
      }
      if(!user){
        return done('User not found', false);
      }
      //We found the user object provide it back
      return done(user, true);
    });
  });

  passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            User.findOne({ 'username' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
    );
    
 passport.use('signup', new LocalStrategy({
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

      findOrCreateUser = function(){
        
        User.findOne({ 'username' :  username }, function(err, user) {
          
          if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
          }
         
          if (user) {
            console.log('User already exists with username: '+username);
            return done(null, false);
          } else {
            
            var newUser = new User();

           
            newUser.username = username;
            newUser.password = createHash(password);

            
            newUser.save(function(err) {
              if (err){
                console.log('Error in Saving user: '+err);
                throw err;
              }
              console.log(newUser.username + ' Registration successful');

              return done(null, newUser);
            });
          }
        });
      };
      
      findOrCreateUser();
    })
  );

  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  };
  // Generates hash using bCrypt
  var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
};