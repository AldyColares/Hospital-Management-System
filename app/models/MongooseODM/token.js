import mongoose from 'mongoose';

let atributeToken = ['tokenSchema', 'token', 'createdAt'];

const ONE_DAY = 43200;
const tokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date, required: true,
    default: Date.now, expires: ONE_DAY
  }
});

// If is duplication of error.

let handleE11000 = function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Date duplication error in database.'));
  } else {
    next(error);
  }
};
tokenSchema.post('save', handleE11000);
tokenSchema.post('update', handleE11000);
tokenSchema.post('findOneAndUpdate', handleE11000);
tokenSchema.post('insertMany', handleE11000);

let Token = mongoose.model("Token", tokenSchema);

export default Token;