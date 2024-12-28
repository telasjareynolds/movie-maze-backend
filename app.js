const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { DB_URL } = require("./utils/config");
const { limiter } = require("./middlewares/rateLimiter");
const indexRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(limiter);

app.use(
  cors({
    origin: "http://movie-maze.twilightparadox.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());

mongoose.set("strictQuery", false);
mongoose.connect(
  DB_URL,
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e)
);

app.use(express.json());
app.use(requestLogger);
app.use("/", indexRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
