
const mongoose = require('mongoose');
const npmValidator = require('validator');

let roomSchema = mongoose.Schema({
  roomType: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: 'the room of type do not empty.',
    }
  },
  //roomId fist field is number, second field is floor hospital. Exemple: 11f2(number 11 of the 
  //second floor).
  roomId: {
    type: String,
    unique: true,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: 'the room of type do not empty.',
    }
  },
  period: {
    type: Date,
    require: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: 'the room of type do not empty.',
    }
  }
});
let Room = mongoose.model('room', roomSchema);
module.exports = { Room };