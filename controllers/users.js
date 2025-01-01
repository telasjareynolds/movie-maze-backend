const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError } = require("../errors/BadRequestError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ConflictError } = require("../errors/ConflictError");
const {
  INVALID_BADREQUEST_MSG,
  ID_BADREQUEST_MSG,
  SUCCESSFUL_REQUEST_MSG,
  SUCCESSFUL_REQUEST,
  CONTFLICT_ERROR_MSG,
  UNAUTHORIZED_ERROR_MSG,
  NOTFOUND_ERROR_MSG,
} = require("../utils/constants");

// create 3 controllers for getUser, createUser, and sign in
const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(INVALID_BADREQUEST_MSG);
  }
  User.findOne({ email })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({ username, email, password: hash }))
    .then((user) =>
      res
        .status(SUCCESSFUL_REQUEST)
        .send({ username: user.username, email: user.email, _id: user._id })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(INVALID_BADREQUEST_MSG));
      } else if (err.code === 11000) {
        next(new ConflictError(CONTFLICT_ERROR_MSG));
      } else {
        next(err);
      }
    });
};

// log in the user
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(INVALID_BADREQUEST_MSG);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({
        token,
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "UnauthorizedError") {
        next(new UnauthorizedError(UNAUTHORIZED_ERROR_MSG));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(INVALID_BADREQUEST_MSG));
      } else {
        next(err);
      }
    });
};

// get current user
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new NotFoundError(NOTFOUND_ERROR_MSG);
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOTFOUND_ERROR_MSG);
      }
      res.send({
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(ID_BADREQUEST_MSG));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
};
