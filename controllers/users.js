const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const {
  validationError,
  notFoundUser,
  existUserAlready,
} = require('../utils/errorMessage');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(200).send({
        data: {
          name, email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(validationError));
      } if (err.code === 11000) {
        next(new ConflictError(existUserAlready));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUser);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(validationError));
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUser);
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(validationError));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUser);
      }
      res.status(200).send({ user });
    })
    .catch(next);
};
