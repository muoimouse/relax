const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = mongoose.model("User");
// const moment = require("moment");
const authService = require("../services/auth.service")(userModel);
// const isAuthenticate = require("../services/passport.service").isAuthenticate;
// let today = moment(moment.now().ISO_8601).format();

module.exports = (app) => {
  app.use("/api/auth", router);
};

router.post("/token", (req, res) => {
  authService.login(req.body, (results) => {
    return res.json(results);
  });
});
