import mongoose from 'mongoose';
import validator from 'validator';

const atributesPacient = ['pid', 'name', 'gender',
  'address', 'dateAdmited', 'dateDischarged', 'contactNo'];

let patientSchema = mongoose.Schema({
  pid: {
    type: String,
    required: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return validator.isAlphanumeric(v);
      },
      message: 'The identification of patient must be combination of words and number.',
    }
  },
  name: {
    type: String,
    required: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return validator.isAlpha(v);
      },
      message: 'The name can not has number.',
    }
  },
  gender: {
    type: String,
    required: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return v === 'male' || v === 'famale';
      },
      message: 'The gender must be male or famale.',
    }
  },
  // must be city, street and zip
  address: {
    type: String,
    required: true,
    lowercare: true,
    trim: true,
    validator: {
      validator: (v) => {
        return !validator.isEmpty(v);
      },
      message: 'The address is...'
    }
  },
  dateAdmited: {
    type: Date,
    required: true,
    validator: {
      validator: (v) => {
        return validator.isDate(v);
      },
      message: ''
    }
  },
  dateDischarged: {
    type: Date,
    required: true,
    validator: {
      validator: (v) => {
        return validator.isDate(v);
      },
      message: ''
    }
  }
  ,
  contactNo: {
    type: String,
    required: true,
    validator: {
      validator: (v) => {
        return !validator.isEmpty(v);
      },
      message: ''
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

patientSchema.post('save', handleE11000);
patientSchema.post('update', handleE11000);
patientSchema.post('findOneAndUpdate', handleE11000);
patientSchema.post('insertMany', handleE11000);

let Patient = mongoose.model('patient', patientSchema);
export default Patient;