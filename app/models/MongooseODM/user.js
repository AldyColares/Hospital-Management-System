import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import hashedPassword from '../safety/secretCrypt';
import { isAlpha, isEmail, isAlphanumeric } from 'validator';
import { sign } from 'jsonwebtoken';

const SALT_FACTOR = 10;
let UserSchema = mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return isAlpha(v, 'pt-BR');

      },
      message: 'the {VALUE} can not has number or especial caracter or empty!'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return isAlphanumeric(v);
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
    required: [true, 'User email required'],
    validate: {
      validator: function (v) {
        return isEmail(v);
      },
      message: 'the {VALUE} is not email valide address! Use "exemple@gmail.com" as model.'
    }
  },
  idLogin: {
    type: String,
    trim: true,
    //unique: true,
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    trim: true
  },
  job: {
    type: String,
    required: true
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

UserSchema.methods.checkPassword = function (guess, callback) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    if (err) return callback(err);
    return callback(null, isMatch);
  });
};

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let token = sign( { _id: user._id.toHexString(), role: user.role }, chashedPassword.toString());
  user.token = token;

  return user.save().then(() => {
    return token;
  });
};

UserSchema.pre('save', function (done) {
  let user = this;
  //Returns true if this document was modified in password.
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return done(err);
    bcrypt.hash(user.password, salt, (err, hashedPassword) => {
      if (err) return done(err);
      user.password = hashedPassword;
      done();
    });
  });
});

let handleE11000 = function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('File duplication error in database.'));
  } else {
    next(error);
  }
};

UserSchema.post('save', handleE11000);
UserSchema.post('update', handleE11000);
UserSchema.post('findOneAndUpdate', handleE11000);
UserSchema.post('insertMany', handleE11000);

let User = mongoose.model('User', UserSchema);

export default User;
