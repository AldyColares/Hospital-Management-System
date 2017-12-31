var mongoose = require('mongoose')
    , validator = require('validator')
    , bcrypt = require('bcrypt-nodejs')
    , secretCrypt = require('../safety/secretCrypt')
    , jwt = require('jsonwebtoken');

const SALT_FACTOR = 10;

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    password: { type: String, require: true },
    email: {
        type: String,
        require: true,
        validate: {
            validator: validator.isEmail,
            massage: '{VALUE} is not a valid email'
        }
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }],
    job: {
        type: String,
        require: true
    },
    phone: { type: String },
    roles: [{ type: 'String' }],
    isVerified: { type: Boolean, default: false },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    creatAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', function (done) {
    // user below is a document object mongoose.
    var user = this;
    //Returns true if this document was modified.
    if (!user.isModified("password")) {
        return done();
    }
    progress = function() {};
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        bcrypt.hash(user.password, salt, progress, (err, hashedPassword) => {
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

UserSchema.methods.generationAuthToken = function () {
    var user = this;
    var access = user.tokens.access;
    var token = jwt.sign({ _id: user._id.toHexString(), access }, secretCrypt.hashedPassword).toString();
    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
}

UserSchema.statics.findByCrendentials = (email, password) => {
    var User = this;

    return User.findOne({ email }, ).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compate(password, user.password, (err, res) => {
                if (res) {
                    resolve(res);
                } else {
                    reject();
                }
            })
        });
    });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;