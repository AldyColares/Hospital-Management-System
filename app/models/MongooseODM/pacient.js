import mongoose from 'mongoose';
import { isEmpty, isDate } from 'validator';
let pacientSchema = mongoose.Schema({
  pid: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !isEmpty(v);
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
        return !isEmpty(v);
      },
      message: '',
    }
  },
  gender: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !isEmpty(v);
      },
      message: '',
    }
  },
  // must be city, street and zip
  address: {
    type: String,
    require: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !isEmpty(v);
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
          return !isDate(v);
        },
        message: ''
      }
    },
    dateDischarged: {
      type: Date,
      require: true,
      validator: {
        validator: (v) => {
          return !isDate(v);
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
        return !isEmpty(v);
      },
      message: ''
    }
  }
});

let handleE11000 = function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('File duplication error in database.'));
  } else {
    next(error);
  }
};

pacientSchema.post('save', handleE11000);
pacientSchema.post('update', handleE11000);
pacientSchema.post('findOneAndUpdate', handleE11000);
pacientSchema.post('insertMany', handleE11000);

let Pacient = mongoose.model('pacient', pacientSchema);
export default Pacient;