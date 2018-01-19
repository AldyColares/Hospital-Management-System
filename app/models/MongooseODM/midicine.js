/*jshint esversion: 6 */

var mongoose = require('mongoose');
var npmValidator = require('validator');

var MedicineSchema = mongoose.Schema({
code: { 
    type: String, 
    required: true, 
    validate: {
        validator: (v) =>{
            return ;
        },
        message: 'the {VALUE} can not by empty',
    }
},
// Serial of fabric of the drug.
batch: {
    type: String, 
    required: true, 
    unique: true,
    validate:{
        validator: (v) =>{
            return npmValidator.is;
        },
        message: 'the {VALUE} can not by empty',
    }
},
quantity: { 
    type: Number, 
    required: true,
    validate: {
        validator: (v) =>{
           if((typeof v === 'number') && v > 0) return true;
           return false;
        },
        message: 'the {VALUE} can by more zero or decimal number',
    }
},
expiration: {
    type: Date, 
    required: true,
    validate: {
        validator: (v)=>{
            return true;
        },
        message: '',
    }
    },
prize: { 
    type: Number, 
    required: true,
    validate: {
        validator: (v)=>{
            return true;
        },
        message: '',
    }
},
creatAt: { 
    type: Date, 
    default: Date.now, 
    validate: {
        validator: (v)=>{
            return true;
        },
        message: '',
    }
}
});

MedicineSchema.pre('save', function (done) {
done();
});

var Medicine = mongoose.model("Medicine", MedicineSchema);
module.exports = Medicine;