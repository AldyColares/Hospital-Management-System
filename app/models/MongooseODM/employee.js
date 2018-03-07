const mongoose = require('mongoose');
let npmValidator = require('validator'),

  employeeSchema = mongoose.Schema({
    EID: {
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
    Salary: {
      type: Number,
      require: true,
      get: v => Math.round(v),
      set: v => Math.round(v),
      min: [5, 'the salary much less.'],
      max: [7 , 'the salary much high.'],
      validate: {
        validator: (v) => {
          return true;
        }
      }
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
    sex: {
      type: String,
      require: true,
      trim: true,
      validate: {
        validator: (v) => {
          return true;
        }
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
          return true;
        }
      }
    }
  }
  );

const Employee = mongoose.model('employee', employeeSchema);
module.exports = { Employee };