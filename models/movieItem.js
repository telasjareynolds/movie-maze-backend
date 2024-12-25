const mongoose = require("mongoose");
const validator = require("validator");

const movieItemSchema = new mongoose.Schema({
  imdbID: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  poster: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "You must enter a valid URL",
    },
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
  },
});

module.exports = mongoose.model("MovieItem", movieItemSchema);
