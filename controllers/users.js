const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcrypt");
const { BadRequestError } = require("../errors/BadRequestError");
const { SUCCESSFUL_REQUEST } = require("../utils/SuccessfulRequest");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { NotFoundError } = require("../errors/NotFoundError");

// create 3 controllers for getUser, createUser, and sign in
const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email or password not valid");
  }
  User.findOne({ email })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({ username, email, password: hash }))
    .then(() =>
      res.status(SUCCESSFUL_REQUEST).send({ message: "User created" })
    )
    .catch((err) =>
      res.status(500).send({ message: "Error creating user:", err })
    );
};

// log in the user
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email or password not valid");
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
        next(new UnauthorizedError("Incorrect email or password"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid input data"));
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
      throw new NotFoundError("Current user not found.");
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
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
        next(new BadRequestError("The id string is in an invalid format"));
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
