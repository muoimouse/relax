const express = require("express");
const glob = require("glob");

// const favicon = require("serve-favicon");
const logger = require("morgan");
// const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const initialize= require("../app/services/passport.service").initialize;
module.exports = (app, config) => {
  const env = process.env.NODE_ENV || "development";
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === "development";

  app.set("views", config.root + "/app/views");
  app.set("view engine", "ejs");

  // use passport
  app.use(initialize);

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  // app.use(cookieParser());
  app.use(compress());

  // public forder to get image
  app.use("/static", express.static(config.root + "/public/uploads/"));
  app.use(methodOverride());

  let controllers = glob.sync(config.root + "/app/controllers/*.js");
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res) => {
    return res.status(404).json({ errCode: "notFound" });
  });

  if (app.get("env") === "development") {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      res.render("error", {
        message: err.message,
        error: err,
        title: "error"
      });
    });
  }

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {},
      title: "error"
    });
  });

  return app;
};
