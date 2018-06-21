import { Schema, model } from 'mongoose';
import { isEmpty, isDate } from 'validator';
let pacientSchema = Schema({
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

let Pacient = model('pacient', pacientSchema);
export default Pacient;