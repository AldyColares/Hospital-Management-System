/*jshint esversion: 6 */
var mongoose = require('mongoose');
var npmValidator = require('validator');

var employeeSchema = mongoose.Schema({
    EID:{
        type:String,
        require: true,
        unique: true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
    Salary:{
        type: Number,
        require:true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
    EAddress:{
        type: String,
        require: true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
    sex:{
        type: String,
        require: true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
    NID:{
        type:String,
        require: true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
    EName:{
        type:String,
        require: true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
    history:{
        type: String,
        require: true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
    ContactNumb:{
        type: String,
        require: true,
        validate: {
            validator: (v) => {
                return true;
            }
        }
    },
}
);

var Employee = mongoose.model('employee', employeeSchema);
module.exports = {Employee};