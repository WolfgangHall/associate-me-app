var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    created: {
      type: Date,
      default: Date.now()
    },
    roomName : {
      type: String,
     
    },
    roomNameTrim : {
    type: String,
    },
    moderator : {
      type: String
    // type: Schema.Types.ObjectId,
    // ref: 'User'
    },
    description: {
      type: String
    },
    messages : [{
      type: String
      // type: Schema.Types.ObjectId,
      // ref: 'Message'
    }]
    });



module.exports = mongoose.model('Room', RoomSchema);