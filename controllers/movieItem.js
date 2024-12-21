const MovieItem = require("../models/movieItem");
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");

// Save movie logic
const saveMovie = (req, res, next) => {
  const { imdbID } = req.params;

  if (!imdbID) {
    throw new BadRequestError("Movie ID is required");
  }
  
  MovieItem.findOneAndUpdate(
    { imdbID },
    {
      $addToSet: { saves: req.user._id },
    },
    { new: true }
  )
    // .orFail(() => {
    //   throw new NotFoundError("Movie ID not found");
    // })
    .then((item) => {
      console.log("HERE IS THE ITEM", item);
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
  const { imdbID } = req.params;
  if (!imdbID) {
    throw new BadRequestError("Movie ID is required");
  }

  MovieItem.findOneAndUpdate(
    { imdbID },
    { $pull: { saves: req.user._id } },
    {
      new: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError("Movie ID not found");
    })
    .then((item) => res.send(item))
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
