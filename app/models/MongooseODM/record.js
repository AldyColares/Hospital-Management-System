import { Schema, model } from 'mongoose';
import npmValidate from 'validator';

let recordSchema = Schema({
  patientId: {
    type: String,
    required: true,
    lowercare: true,
    trim: true
  },
  recordNo: {
    type: String,
    required: true,
    lowercare: true,
    trim: true
  },
  discription: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    required: [true, 'discription is required.']
  },
  appoinmest: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    required: [true, 'appoinmest is required.']
  }
});

let handleE11000 = function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('File duplication error in database.'));
  } else {
    next(error);
  }
};

recordSchema.post('save', handleE11000);
recordSchema.post('update', handleE11000);
recordSchema.post('findOneAndUpdate', handleE11000);
recordSchema.post('insertMany', handleE11000);

let Record = model('record', recordSchema);
export default Record;

