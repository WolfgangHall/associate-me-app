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
    moderator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
    }

});

var Rooms = mongoose.model('Rooms', RoomsSchema);
module.exports = Rooms;