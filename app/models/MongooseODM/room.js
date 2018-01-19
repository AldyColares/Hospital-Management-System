/*jshint esversion: 6 */
var mongoose = require('mongoose');
var npmValidator = require('validator');
var roomSchema = mongoose.Schema({
    roomType: {
        type: String,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: 'the room of type do not empty.',
        }
    },
    //roomId fist field is number, second field is floor hospital. Exemple: 11F2(number 11 of the 
    //second floor).
    roomId: {
        type: String,
        unique: true, 
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: 'the room of type do not empty.',
        }
    },
    period: {
        type: Date,
        require: true,
        validator: {
            validator: (v) => {
                return !npmValidator.isEmpty(v);
            },
            message: 'the room of type do not empty.',
        }
    }
});

var Room = mongoose.model('room', roomSchema);
module.exports = {Room};