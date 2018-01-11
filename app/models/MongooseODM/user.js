//import { error } from 'util';

var mongoose = require('mongoose'),
    validator = require('validator'),
    bcrypt = require('bcrypt-nodejs'),
    secretCrypt = require('../safety/secretCrypt'),
    jwt = require('jsonwebtoken');

const SALT_FACTOR = 10;

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,

    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate: {
            isAsync: true,

            validator: {
                function(v) {
                   return ;
                }
            }
        }
    },
    idLogin: {
        type: String,
        unique: true
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
    isVerified: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    creatAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function (done) {
    // user below is a document object mongoose.
    var user = this;
    user.validate(function (err) {
        for (proprety in err.errors) {
            console.log(`${proprety} : ${err.errors[proprety]}`);
        }
        done(new Error("error save new user"));
    });
    //Returns true if this document was modified.
    if (!user.isModified("password")) {
        return done();
    }
    progress = function () { };
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        bcrypt.hash(user.password, salt, progress, (err, hashedPassword) => {
            if (err) { return done(err); }
            user.password = hashedPassword;
            done();
        });
    });
});

UserSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

UserSchema.methods.generateAuthToken = function (access) {
    if (!access) return Promise.reject(new Error("access is undefined"));
    var user = this;
    var token = jwt.sign({ _id: user._id.toHexString(), access }, secretCrypt.hashedPassword).toString();
    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByCredentials = (user, loginPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, user) => {
            if (user) {
                resolve(res);
            } else {
                reject();
            }
        });
    });
};

var User = mongoose.model('User', UserSchema);
module.exports = User;
