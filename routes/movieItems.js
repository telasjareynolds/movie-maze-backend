const router = require("express").Router();
const {
  saveMovie,
  unsaveMovie,
  getSavedMovies,
} = require("../controllers/movieItem");
const { validateId, validateMovieData } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

// route for getting saved movies
router.get("/", auth, getSavedMovies);

// route for saving movie
router.post("/", auth, validateMovieData, saveMovie);

// route for unsaving movie
router.delete("/:imdbID", validateId, auth, unsaveMovie);

module.exports = router;
