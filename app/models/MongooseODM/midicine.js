import { Schema, model } from 'mongoose';
import { is } from 'validator';

let MedicineSchema = Schema({
  code: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return;
      },
      message: 'the {VALUE} can not by empty'
    }
  },
  // Serial of fabric of the drug. It should be required fecht for the validity of the remedies.
  batch: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        return is;
      },
      message: 'the {VALUE} can not by empty'
    }
  },
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => {
        if ((typeof v === 'number') && v > 0) { return true; }
        return false;
      },
      message: 'the {VALUE} can by more zero or decimal number'
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

let Medicine = model("Medicine", MedicineSchema);
export default Medicine;