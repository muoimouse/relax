const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const moment = require("moment");
const JWT = require("jsonwebtoken");

let errorCodes = {

};

let today = moment(moment.now().ISO_8601).format();

module.exports = (app) => {
  app.use("/auth", router);
};

router.get("/token", (req, res) => {

});
