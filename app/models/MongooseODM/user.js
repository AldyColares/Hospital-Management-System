var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name:{type:String, require: true, unique: true},
    password:{type:String, require: true},
    email:{type:String, require: true},
    password:{type:String, require: true},
    phone:{type:String, require: true},
    creatAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', function(done){
    done();
})

var User = mongoose.model('User', UserSchema);
module.exports = User;