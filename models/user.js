const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/unauthorizedError');
const {
  emailError,
  fillField,
  lengthFieldMin,
  lengthFieldMax,
  unauthError,
} = require('../utils/errorMessage');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, fillField],
    minlength: [2, lengthFieldMin],
    maxlength: [30, lengthFieldMax],
    default: 'Кинолюбитель',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: emailError,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlenght: 8,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(unauthError);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(unauthError);
          }
          return user;
        });
    });
};

userSchema.set('toJSON', {
  transform(doc, res) {
    delete res.password;
    return res;
  },
});
module.exports = mongoose.model('user', userSchema);
