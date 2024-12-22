const MovieItem = require("../models/movieItem");
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");

// Save movie logic
const saveMovie = (req, res, next) => {
  const { imdbID } = req.body;
  const owner = req.user._id;

  if (!imdbID) {
    throw new BadRequestError("Movie ID is required");
  }

  MovieItem.create({ imdbID, owner })
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Id in incorrect format"));
      } else {
        next(err);
      }
    });
};

// Unsave movie logic
const unsaveMovie = (req, res, next) => {
  const { imdbID } = req.body;
  const userId = req.user._id;

  if (!imdbID) {
    throw new BadRequestError("Movie ID is required");
  }

  MovieItem.findOne({ imdbID })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Not authorized to unsave item");
      }
      return MovieItem.delete({ imdbID });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Id in incorrect format"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  saveMovie,
  unsaveMovie,
};
