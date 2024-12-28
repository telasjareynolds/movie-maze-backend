module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "your_secret_key",
  DB_URL: process.env.DB_URL || "mongodb://127.0.0.1:27017/movie-maze_db",
};
