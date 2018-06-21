const mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  secretCrypt = require('../safety/secretCrypt').default,
  npmValidator = require('validator'),
  jwt = require('jsonwebtoken');

const SALT_FACTOR = 10;
let UserSchema = mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    require: true,
    unique: true,
    validate: {
      validator: function (v) {
        return npmValidator.isAlpha(v, 'pt-BR');

      },
      message: 'the {VALUE} is can not exist number, especial caracter or empty!'
    }
  },
  password: {
    type: String,
    require: true,
    validate: {
      validator: function (v) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,20}$/.test(v);
      },
      message: 'The size of the password {Value} must has between 8 and 20.' +
        'It must has combine of letters, number and special characters.'
    }
  },
  email: {
    type: String,
    unique: true,
    lowercare: true,
    trim: true,
    validate: {
      validator: function (v) {
        return npmValidator.isEmail(v);
      },
      message: 'the {VALUE} is not email valide address! Use "exemple@gmail.com" as model.'
    },
    required: [true, 'User email required']

  },
  idLogin: {
    type: String,
    trim: true,
    unique: true
  },
  role: {
    type: String,
    require: true,
    trim: true
  },
  token: {
    type: String,
    require: true,
    trim: true
  },
  job: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  creatAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function (done) {
  let user = this;
  //Returns true if this document was modified in password.
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    let progress = function () { };
    bcrypt.hash(user.password, salt, progress, (err, hashedPassword) => {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

UserSchema.methods.checkPassword = function (guess, next) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    if (err) { return next(err); }
    if (isMatch) {
      return isMatch;
    }
    return false;
  });
};

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let token = jwt.sign({ _id: user._id.toHexString(), role: user.role },
    secretCrypt.hashedPassword).toString();
  user.token = token;

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByCredentials = (user, loginPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(loginPassword, user.password, (err, user) => {
      if (user) {
        resolve(res);
      } else {
        reject();
      }
    });
  });
};

let handleE11000 = function (error, res, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

UserSchema.post('save', handleE11000);
UserSchema.post('update', handleE11000);
UserSchema.post('findOneAndUpdate', handleE11000);

let User = mongoose.model('User', UserSchema);
module.exports = User;