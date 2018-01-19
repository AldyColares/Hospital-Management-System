/*jshint esversion: 6 */
var mongoose = require('mongoose');
var npmValidator = require('validator');

var pacientSchema = mongoose.Schema({
    pid: {
        type: String,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: '',
        }
    },
    name: {
        type: String,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: '',
        }
    },
    sex: {
        type: String,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: '',
        }
    },
    address: {
        type: String,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: '',
        }
    },
    pDetailts: {
        type: String,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: '',
        }
    },
    contactNo: {
        type: String,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: '',
        }
    }
});

var Pacient = mongoose.model('pacient', pacientSchema);