const MovieItem = require("../models/movieItem");
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/BadRequestError");

// Save movie logic
const saveMovie = (req, res, next) => {
  const { imdbID } = req.body;
  const owner = req.user._id;

  if (!imdbID) {
    throw new BadRequestError("Movie ID is required");
  }

  MovieItem.findOneAndUpdate(
    { imdbID, owner },
    { imdbID, owner },
    { upsert: true, new: true }
  )
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(err);
      }
    });
};

// Unsave movie logic
const unsaveMovie = (req, res, next) => {
  const { imdbID } = req.params;
  const userId = req.user._id;

  if (!imdbID) {
    throw new BadRequestError("Movie ID is required");
  }

  MovieItem.findOneAndDelete({ imdbID, owner: userId })
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Movie not found or not saved by this user");
      }
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Not authorized to unsave item");
      }

      return MovieItem.findOneAndDelete({ imdbID, owner: userId }).then(() =>
        res.json({ message: "Movie unsaved successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID format"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  saveMovie,
  unsaveMovie,
};
