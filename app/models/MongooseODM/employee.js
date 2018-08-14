import mongoose from 'mongoose';
import npmValidator from 'validator';

const fieldNameDocuments = ['EID', 'Salary', 'EAddress', 'gender', 'NID', 'EName',
  'history', 'ContactNumb'],
  employeeSchema = mongoose.Schema({
    // Employee Identification
    EID: {
      type: String,
      required: [true, 'The indentification of Employee is necessary.'],
      trim: true,
      unique: true,
      validate: {
        validator: (v) => {
          return npmValidator.isAlphanumeric(v);
        }
      },
      message: 'ID of Employer must be Alpha and/or numeric.'
    },
    Salary: {
      type: Number,
      required: true,
      get: v => Math.round(v),
      set: v => Math.round(v),
      min: [5000, 'the salary much less.'],
      max: [7000, 'the salary much high.'],
      validate: {
        validator: (v) => {
          return validator.isNumeric(v);
        }
      },
      message: 'the salary {VALUE} must be number'
    },
    EAddress: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          return typeof v === 'string';
        }
      }
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => {
          return (v === 'male' || v === 'famale');
        },
        message: 'The name of field gender must has "male" or "famele".'
      }
    },
    NID: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: (v) => {
          return validator.isAlphanumeric(v);
        }
      },
      message: 'the indentification of user of Employer must be Alpha and/or numeric.'
    },
    EName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => {
          return typeof v === 'string';
        }
      },
      message: 'The employee name must be insert.'
    },
    history: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => {
          return typeof v === 'string';
        }
      },
      message: 'The history can not be empty.'
    },
    ContactNumb: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => {
          return npmValidator.isMobilePhone(v, ['en-AU', 'pt-PT']);
        },
        message: 'The number phone can not format {VALUE}.'
      }
    }
  }
  );


let handleE11000 = function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error('File duplication error in database.'));
  } else {
    let err = new Error(error.message);
    next(err);
  }
};

employeeSchema.post('save', handleE11000);
employeeSchema.post('update', handleE11000);
employeeSchema.post('findOneAndUpdate', handleE11000);
employeeSchema.post('insertMany', handleE11000);

const Employee = mongoose.model('employee', employeeSchema);

export default { Employee, fieldNameDocuments };
