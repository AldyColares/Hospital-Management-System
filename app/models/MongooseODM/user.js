/*jshint esversion: 6 */
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    secretCrypt = require('../safety/secretCrypt'),
    jwt = require('jsonwebtoken');

const SALT_FACTOR = 10;

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        validate: {
            validator:function(v) {
                return /^[a-zA-Z]+$/.test(v);
            },
            message: '{VALUE} is can not exist number!'
        }
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    email: {
        type: String,
        unique: true,
        lowercare: true,
        validate: {
            validator: function(v){
                return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,}$/.test(v);
            },
            message: '{VALUE} is not email address valide!'
        }, 
        required: [true, 'User email required']
        
    },
    idLogin: {
        type: String,
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

UserSchema.pre('save', function(err) {
    // user below is a document object mongoose.
    var user = this;
    user.validate(function (err) {
        return done(err);
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
