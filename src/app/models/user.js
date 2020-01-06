const mongoose = require('../../database');
const Encrypt = require('../../lib/encrypter');

const encrypter = new Encrypt();


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  this.password = await encrypter.generateHash(this.password);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
