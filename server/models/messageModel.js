var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var relationship = require("mongoose-relationship");
// var Room = mongoose.model("Room", RoomSchema);


  var MessageSchema = new Schema({
    created: {
      type: Date,
      default: Date.now()
    },
    message : {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true
    },
    room :{
      type: String
      // type: Schema.Types.ObjectId,
      // ref: 'Room'
    }
    
    });



var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;