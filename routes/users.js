const router = require("express").Router();
const { getCurrentUser, createUser, login } = require("../controllers/users");
const {
  validateUserCreation,
  validateLoginAuth,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");

// Routes
// get user by id
router.get("/users/me", auth, getCurrentUser);

// post creates a new user
router.post("/signup", validateUserCreation, createUser);

// post for signing in
router.post("/signin", validateLoginAuth, login);

module.exports = router;
