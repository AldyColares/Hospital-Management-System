const mongoose = require('mongoose'),
  npmValidator = require('validator'),
  nameFieldDocuments = ['EID', 'Salary', 'EAddress', 'gender', 'NID', 'EName',
    'history', 'ContactNumb'],

  employeeSchema = mongoose.Schema({
    // Employee Identification
    EID: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      validate: {
        validator: (v) => {
          return npmValidator.isAlphanumeric;
        }
      },
      message: 'ID of Employer must be Alphanumeric'
    },
    Salary: {
      type: Number,
      require: true,
      get: v => Math.round(v),
      set: v => Math.round(v),
      min: [5, 'the salary much less.'],
      max: [7, 'the salary much high.'],
      validate: {
        validator: (v) => {
          return typeof v === 'number';
        }
      },
      message: 'the salary {VALUE} must be number'
    },
    EAddress: {
      type: String,
      require: true,
      validate: {
        validator: (v) => {
          return true;
        }
      }
    },
    gender: {
      type: String,
      require: true,
      trim: true,
      validate: {
        validator: (v) => {
          return (v === 'male' || v === 'famale');
        },
        message: ' the name of field gender must has "male" or "famele".'
      }
    },
    NID: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      validate: {
        validator: (v) => {
          return true;
        }
      }
    },
    EName: {
      type: String,
      require: true,
      trim: true,
      validate: {
        validator: (v) => {
          return true;
        }
      }
    },
    history: {
      type: String,
      require: true,
      trim: true,
      validate: {
        validator: (v) => {
          return true;
        }
      }
    },
    ContactNumb: {
      type: String,
      require: true,
      trim: true,
      validate: {
        validator: (v) => {
          return npmValidator.isMobilePhone(v, ['en-AU', 'pt-PT']);
        },
        message: 'the number phone do not format {VALUE}'
      }
    }
  }
  );

const Employee = mongoose.model('employee', employeeSchema);
module.exports = { Employee, nameFieldDocuments };