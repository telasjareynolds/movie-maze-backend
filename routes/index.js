const router = require("express").Router();
const userRouter = require("./users");
const movieItemRouter = require("./movieItems");
const { NotFoundError } = require("../errors/NotFoundError");

router.use("/", userRouter);
router.use("/", movieItemRouter);

router.use(() => {
  throw new NotFoundError(
    "The requested resource was not found on the server. Please check your request and try again."
  );
});

module.exports = router;
