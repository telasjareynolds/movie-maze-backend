const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { UnauthorizedError } = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "You must enter a valid e-mail address",
    },
  },
  password: {
    type: String,
    required: true,
    select: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Incorrect email or password")
          );
        }
        return user;
      });
    });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
