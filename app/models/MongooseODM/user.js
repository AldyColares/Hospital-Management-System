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
                return true;
                // the Bug of caractere 'ç'.The mongoBD trigger erro if insert that caractere.
                //return /^[A-ZÀ-Ÿ][A-zÀ-ÿ']+\s([A-zÀ-ÿ']\s?)*[A-ZÀ-Ÿ][A-zÀ-ÿ']+$/.test(v);
            },
            message: 'the {VALUE} is can not exist number, especial caracter or empty!',
        }
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        lowercare: true,
        validate: {
            validator: function(v){
                return /^[a-z0-9_.+-]+@[a-z0-9]+\.[a-z0-9]{2,}$/.test(v);
            },
            message: 'the {VALUE} is not email valide address! Use "exemple@gmail.com" as model.'
        }, 
        required: [true, 'User email required']
        
    },
    idLogin: {
        type: String
    },
    role: {
        type: String
    },
    token: {
        type: String
    },
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

UserSchema.pre('save', function(done) {
    // user below is a document object mongoose.
    var user = this;
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

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var token = jwt.sign({ _id: user._id.toHexString(), role: user.role }, secretCrypt.hashedPassword).toString();
    user.token = token;

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