import mongoose from 'mongoose';
import { isEmpty } from 'validator';

const atributesRoom = ['roomType', 'roomId', 'period'];
let roomSchema = mongoose.Schema({
  roomType: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !isEmpty(v);
      },
      message: 'the room of type do not empty.',
    }
  },
  /*roomId fist field is number, second field is floor hospital. Exemple: 11f2(number 11 of the 
  second floor). */
  roomId: {
    type: String,
    unique: true,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !isEmpty(v);
      },
      message: 'the room of type do not empty.',
    }
  },
  /* the period of patient will stay in the room. 
  */
  period: {
    type: Date,
    require: true,
    validator: {
      validator: (v) => {
        return !isEmpty(v);
      },
      message: 'the room of type do not empty.',
    }
  }
});

let handleE11000 = function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error('File duplication error in database.'));
  } else {
    let err = new Error(error.message);
    next(err);
  }
};

roomSchema.post('save', handleE11000);
roomSchema.post('update', handleE11000);
roomSchema.post('findOneAndUpdate', handleE11000);
roomSchema.post('insertMany', handleE11000);

let Room = mongoose.model('room', roomSchema);
export default { Room };

