const router = require("express").Router();
const { saveMovie, unsaveMovie } = require("../controllers/movieItem");
const { validateId } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

// route for saving movie
router.put("/movies/:imdbID/saves", validateId, auth, saveMovie);

// route for unsaving movie
router.delete("/movies/:imdbID/saves", validateId, auth, unsaveMovie);

module.exports = router;
