const MovieItem = require("../models/movieItem");
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");

// Save movie logic
const saveMovie = (req, res, next) => {
  const { imbdId } = req.params;

  if (!imbdId) {
    throw new BadRequestError("Movie ID is required");
  }

  MovieItem.findByIdAndUpdate(
    imbdId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
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

// Unsave movie logic
const unsaveMovie = (req, res, next) => {
  const { imbdId } = req.params;
  if (!imbdId) {
    throw new BadRequestError("Movie ID is required");
  }

  MovieItem.findByIdAndUpdate(
    imbdId,
    { $pull: { likes: req.user._id } },
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
