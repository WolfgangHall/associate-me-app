var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/userRegistration');

  var db = mongoose.connection;

  db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
  });
  db.once('open', function() {
    console.log('Mongoose connection successful.');
  });

module.exports = db;