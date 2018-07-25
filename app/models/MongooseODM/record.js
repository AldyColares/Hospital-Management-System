const mongoose = require('mongoose'),
  npmValidate = require('validator');

let recordSchema = mongoose.Schema({
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

let Record = mongoose.model('record', recordSchema);
module.exports = Record;

