var mongoose = require('mongoose');
var npmValidate = require('validator');
var recordSchema = mongoose.Schema({
    patientId: {
        type: Number,
        min: [10000, 'patientId indentification invalid.'],
        
    },
    recordNo: {
        type: Number,
        min: [10000, 'recordNo indentification invalid.']
    },
    discription: {
        type: String,
        require: [true, 'discription is required.']
    },
    appoinmest: {
        type: String,
        require:[true, 'appoinmest is required.']
    }
});
var Record = mongoose.model('record', recordSchema);
module.exports = Record;