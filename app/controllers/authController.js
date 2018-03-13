const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const moment = require("moment");
const authService = require("../services/auth.service")(userModel);
const passport = require("../services/passport.service");
let today = moment(moment.now().ISO_8601).format();

module.exports = (app) => {
  app.use("/auth", router);
};

router.post("/token", (req, res) => {
  authService.login(req.body, (results) => {
    return res.json(results);
  });
});
router.get("/test", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json("authen ok");
});
