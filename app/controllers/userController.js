const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const userService = require("../services/user.service")(userModel);
const moment = require("moment");
const multer = require("multer");

const passport = require("../services/passport.service");

let today = moment(moment.now().ISO_8601).format("YYYY-MM-DD");

// Set up upload file with multer
let imageFilter = (req, file, cb) => {
  if ("image/jpeg" && "image/jpg" && "image/png" !== file.mimetype && file.size > 2000000) {
    return cb(null, false);
  }
  return cb(null, true);
};
let upload = multer({dest: `./public/uploads/user/${today}/`, fileFilter: imageFilter});

module.exports = (app) => {
  app.use("/api/user",router);
  // app.use("/api/user", router);
};

// router.set("/", passport.authenticate("jwt", { session: false }));

router.get("/", (req, res) => {
  console.log(req.headers);
  userService.getUser(req.query, (results) => {
    return res.json(results);
  });
});

router.put("/", upload.single("image"), (req, res) => {
  userService.updateUser(req.body, req.file, (results) => {
    return res.json(results);
  });
});

router.post("/", upload.single("image"), (req, res) => {
  userService.saveUser(req.body, req.file, (results) => {
    return res.json(results);
  });
});

router.delete("/", (req, res) => {
  userService.deleteUser(req.body, (results) => {
    return res.json(results);
  });
});


