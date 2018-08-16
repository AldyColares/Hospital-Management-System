import mongoose from 'mongoose';
import npmValidate from 'validator';

const listElements = ['patientId', 'recordNo', 'discription', 'appoinmest'];

let recordSchema = mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Identification of patient is required.'],
    lowercare: true,
    trim: true,
    validate: {
      validator: (v) => {
        return npmValidator.isAlphanumeric(v);
      }
    },
    message: 'The ID of Patient must be Alpha and/or numeric.'
  },
  recordNo: {
    type: String,
    required: [true, 'Number of record is required.'],
    lowercare: true,
    trim: true, 
    validate: {
      validator: (v) => {
        return npmValidator.isAlphanumeric(v);
      }
    },
    message: 'The ID of record must be Alpha and/or numeric.'

  },
  discription: {
    type: String,
    required: [true, 'discription is required.'],
    lowercare: true,
    trim: true, 
    validate: {
      validator: (v) => {
        return npmValidator.isAlphanumeric(v);
      }
    },
    message: 'ID of Employer must be Alpha and/or numeric.'
  },
  appoinmest: {
    type: String,
    required: [true, 'appoinmest is required.'],
    lowercare: true,
    trim: true,
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

recordSchema.post('save', handleE11000);
recordSchema.post('update', handleE11000);
recordSchema.post('findOneAndUpdate', handleE11000);
recordSchema.post('insertMany', handleE11000);

let Record = mongoose.model('record', recordSchema);
export default Record;

