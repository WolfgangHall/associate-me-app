var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomsSchema = new Schema({
    created: {
      type: Date,
      default: Date.now()
    },
    roomName : {
      type: String,
      trim: true
    },
    description: {
    type: String,
    trim: true
    },
    moderator: {
      type: String,
    }

});

var Rooms = mongoose.model('Rooms', RoomsSchema);
module.exports = Rooms;