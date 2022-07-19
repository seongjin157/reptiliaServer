const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
  message: String,
  email: String,
  phonenumber: Number,
  // desciption: String,
  // address: String,
  // joinedDate: {
  //   type: Date,
  //   default: new Date(),
  // },
});

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.setMessage = async function (message) {
  this.message = message;
};

UserSchema.methods.setEmail = async function (email) {
  this.email = email;
};

UserSchema.methods.setPhonenumber = async function (phonenumber) {
  this.phonenumber = phonenumber;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  delete data._id;
  delete data.__v;

  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
      message: this.message,
      email: this.email,
      phonenumber: this.phonenumber,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
  return token;
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
