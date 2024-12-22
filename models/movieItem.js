const mongoose = require("mongoose");

const movieItemSchema = new mongoose.Schema({
  imdbID: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("MovieItem", movieItemSchema);
