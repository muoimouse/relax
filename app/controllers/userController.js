const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const User = require("../services/user.service")(userModel);
const moment = require("moment");
const multer = require("multer");
const fs = require("fs");

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
  app.use("/user", router);
};

router.get("/", (req, res) => {
  User.get(req.query, (results) => {
    return res.json(results);
  });
});

router.put("/", upload.single("image"), (req, res) => {
  User.saveUser(req.body, req.file, (results) => {
    return res.json(results);
  });
});

router.post("/", upload.single("image"), (req, res, next) => {
  let updateData = req.body;
  
  if (!updateData.email) {
    return res.json(new Error(errorCodes.InvalidEmail));
  }
  
  // Update fileName
  let fileName = changeFileName(req);
  if (fileName !== updateData.email) {
    updateData.image = today + "/" + fileName;
  }
  userModel.where().findOneAndUpdate({email: updateData.email}, {$set: updateData}, (err, result) => {
    if (err) {
      if (req.file) {
        fs.unlinkSync(`./public/uploads/user/${today}/${req.file.filename}`);
      }
      return next(err);
    }
    if (!result) {
      return res.json({message: errorCodes.UpdateFail});
    }
    if (req.file) {
      fs.renameSync(`./public/uploads/user/${today}/${req.file.filename}`, `./public/uploads/user/${today}/${fileName}`, (err) => {
        if (err) {
          return next(err);
        }
      });
    }
    return res.json({message: "updateCompleted"});
  });
});

router.delete("/", (req, res) => {
  let email = req.body.email;
  if (!email) {
    return res.json({errCode: errorCodes.InvalidEmail});
  }
  userModel.findOne({email: email}, (err, result) => {
    if (err || !result || result.type === "admin") {
      return res.json({errCode: errorCodes.RemoveFail});
    }
    userModel.where().findOneAndRemove({email: req.body.email}, (err, result) => {
      if (err || !result) {
        return res.json({errCode: errorCodes.RemoveFail});
      }
      return res.json({message: "removeSuccessful"});
    });
  });
});


