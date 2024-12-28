const MovieItem = require("../models/movieItem");
const { BadRequestError } = require("../errors/BadRequestError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const {
  ID_BADREQUEST_MSG,
  FORBIDDEN_ERROR_MSG,
} = require("../utils/constants");

// Get saved movie items for watchlist
const getSavedMovies = (req, res, next) => {
  const owner = req.user._id;

  MovieItem.find({ owner })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => next(err));
};

// Save movie logic
const saveMovie = (req, res, next) => {
  const { imdbID, title, poster, year } = req.body;
  const owner = req.user._id;

  if (!imdbID) {
    throw new BadRequestError(ID_BADREQUEST_MSG);
  }
  MovieItem.findOneAndUpdate(
    { imdbID, owner },
    { imdbID, title, poster, year },
    { upsert: true, new: true }
  )
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(ID_BADREQUEST_MSG));
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
    throw new BadRequestError(ID_BADREQUEST_MSG);
  }

  MovieItem.findOne({ imdbID, owner: userId })
    .then((item) => {
      if (!item) {
        throw new ForbiddenError(
          FORBIDDEN_ERROR_MSG
        );
      }

      return MovieItem.findOneAndDelete({ imdbID, owner: userId }).then(() =>
        res.json({ message: "Movie unsaved successfully" })
      );
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
  saveMovie,
  unsaveMovie,
  getSavedMovies,
};
