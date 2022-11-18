require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("hello there");
});

// routes
app.use("/api/users", require("./routes/test.user.routes"));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  return next(err);
});
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({ message: err.message, error: err });
  });
}

module.exports = app;
