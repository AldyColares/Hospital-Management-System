/*jshint esversion: 6 */
const mongoose = require('mongoose');
const npmValidator = require('validator');
let pacientSchema = mongoose.Schema({
  pid: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: '',
    }
  },
  name: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: '',
    }
  },
  sex: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: '',
    }
  },
  address: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: ''
    }
  },
  pDetailts: [{
    dateAdmited: {
      type: Date,
      require: true,
      validator: {
        validator: (v) => {
          return !npmValidator.isDate(v);
        },
        message: ''
      }
    },
    dateDischarged: {
      type: Date,
      require: true,
      validator: {
        validator: (v) => {
          return !npmValidator.isDate(v);
        },
        message: ''
      }
    }
  }],
  contactNo: {
    type: String,
    require: true,
    validator: {
      validator: (v) => {
        return !npmValidator.isEmpty(v);
      },
      message: ''
    }
  }
});

let Pacient = mongoose.model('pacient', pacientSchema);
module.exports = Pacient;