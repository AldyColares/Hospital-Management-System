import mongoose from 'mongoose';
import validator from 'validator';

let MedicineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => {
        return validator.isAlpha(v);
      },
      message: 'The medicine name can not by empty.'
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
      message: 'The batch can not by empty'
    }
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        return parseInt(v) >= 0;
      },
      message: 'The {VALUE} can by natural number.'
    }
  },
  // The validity of the remedy.
  expiration: {
    type: Date,
    required: true,
    validate: {
      validator: (v) => {
        return true;
      },
      message: 'the {VALUE} must be format number '
    }
  },

  prize: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        console.log( typeof v == "number", v )
        return validator.isNumeric(v.toString());
      },
      message: 'The valor must be '
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

let handleE11000 = function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error('File duplication error in database.'));
  } else {
    next(new Error(error.message));
  }
};

MedicineSchema.post('save', handleE11000);
MedicineSchema.post('update', handleE11000);
MedicineSchema.post('findOneAndUpdate', handleE11000);
MedicineSchema.post('insertMany', handleE11000);

let Medicine = mongoose.model("Medicine", MedicineSchema);

export default Medicine;