import mongoose from 'mongoose';
import validator from 'validator';

let MedicineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return;
      },
      message: 'The {VALUE} can not by empty'
    }
  },
  // Serial of fabric of the drug. It should be required fecht for the validity of the remedies.
  batch: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        return validator.isAlphanumeric(v);
      },
      message: 'The {VALUE} can not by empty'
    }
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        if ( v >= 0) {
          return true;
        }
        return false;
      },
      message: 'The {VALUE} can by natural number.'
    }
  },
  // the validity of the remedy.
  expiration: {
    type: Date,
    required: true,
    validate: {
      validator: (v) => {
        return true;
      },
      message: ''
    }
  },

  prize: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        return true;
      },
      message: ''
    }
  },

  creatAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (v) => {
        return true;
      },
      message: ''
    }
  }
});

let Medicine = mongoose.model("Medicine", MedicineSchema);

export default Medicine;