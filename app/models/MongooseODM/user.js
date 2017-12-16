var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const SALT_FACTOR = 10;

var UserSchema = mongoose.Schema({
    name: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    phone: { type: String},
    roles: [{ type: 'String' }],
    isVerified: { type: Boolean, default: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    creatAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', function (done) {
    // user above is a document objec mongoose.
    var user = this;
    //Returns true if this document was modified, else false.
    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) { return done(err); }
              
        var noop = function () {};
        bcrypt.hash(user.password, salt, noop,
            function (err, hashedPassword) {
                if (err) { return done(err); }
                user.password = hashedPassword;
                done();
            });
    });

})  

UserSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};
var User = mongoose.model('User', UserSchema);
module.exports = User;