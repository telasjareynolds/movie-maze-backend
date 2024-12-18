const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const indexRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(helmet());

mongoose.connect(
  "mongodb://127.0.0.1:27017/movie-maze_db",
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
