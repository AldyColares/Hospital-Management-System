import mongoose from 'mongoose';
import npmValidate from 'validator';

const listElements = ['patientId', 'recordNo', 'discription', 'appoinmest'];

let recordSchema = mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Identification of patient is required.'],
    lowercare: true,
    trim: true
  },
  recordNo: {
    type: String,
    required: [true, 'Number of record is required.'],
    lowercare: true,
    trim: true
  },
  discription: {
    type: String,
    required: [true, 'discription is required.'],
    lowercare: true,
    trim: true,
  },
  appoinmest: {
    type: String,
    required: [true, 'appoinmest is required.'],
    lowercare: true,
    trim: true,
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

let Record = mongoose.model('record', recordSchema);
export default Record;

