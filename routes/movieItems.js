const router = require("express").Router();
const { saveMovie, unsaveMovie } = require("../controllers/movieItem");
const { validateId } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

// route for saving movie
router.put("/", validateId, auth, saveMovie);

// route for unsaving movie
router.delete("/", validateId, auth, unsaveMovie);

module.exports = router;
