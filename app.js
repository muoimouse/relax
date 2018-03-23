const express = require("express");
const config = require("./config/config");
const glob = require("glob");
const mongoose = require("mongoose");

mongoose.connect(config.db);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => {
  throw new Error("unable to connect to database at " + config.db);
});

const models = glob.sync(config.root + "/app/models/*.js");
models.forEach(function(model) {
  require(model);
});
const app = express();
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,content-type, authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

module.exports = require("./config/express")(app, config);

app.listen(config.port, () => {
  console.log("Express server listening on port " + config.port);
});
