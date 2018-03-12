const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const vocabularyModel = mongoose.model("Vocabulary");
const moment = require("moment");
const multer = require("multer");
const fs = require("fs");

const errorCodes = {
  InvalidVocabularyTitle: "InvalidVocabularyTitle",
  InvalidParameter: "InvalidParameter",
  InvalidVocabulary: "InvalidVocabulary",
  UpdateFail: "UpdateFail"
};
let today = moment(moment.now().ISO_8601).format("YYYY-MM-DD");

// Set up upload file with multer
let imageFilter = (req, file, cb) => {
  if ("image/jpeg" && "image/jpg" && "image/png" !== file.mimetype && file.size > 2000000) {
    return cb(null, false);
  }
  return cb(null, true);
};
let upload = multer({ dest: `./public/uploads/vocabulary/${today}/`, fileFilter: imageFilter });


module.exports = (app) => {
  app.use("/vocabulary", router);
};

router.get("/", (req, res, next) => {
  vocabularyModel.find(req.query, (err, result) => {
    if (err) {
      return next(err);
    }
    return res.json(result);
  });
});

router.put("/", upload.single("image"), (req, res, next) => {
  let putData = req.body;
  if (!putData.title) {
    return next(new Error(errorCodes.InvalidVocabularyTitle));
  }
  
  // change fileName
  let fileName = changeFileName(req);
  if (fileName !== putData.title) {
    putData.image = today + "/" + fileName;
  }
  
  let vocabulary = new vocabularyModel(putData);
  vocabulary.save((err) => {
    if (err) {
      fs.unlinkSync(`./public/uploads/vocabulary/${today}/${req.file.filename}`);
      return next(err);
    }
    fs.renameSync(`./public/uploads/vocabulary/${today}/${req.file.filename}`, `./public/uploads/vocabulary/${putData.image}`, (err) => {
      if (err) {
        return next(err);
      }
    });
    return res.json({ message: "saveCompleted" });
  });
});

router.post("/", upload.single("image"), (req, res, next) => {
  let updateData = req.body;
  
  // Check existence of title in req.body
  if (!updateData.title) {
    return next(new Error(errorCodes.InvalidVocabularyTitle));
  }
  
  //  update fileName
  let fileName = changeFileName(req);
  if (fileName !== updateData.title) {
    updateData.image = today + "/" + fileName;
  }
  vocabularyModel.where().findOneAndUpdate({ title: req.body.title }, { $set: updateData }, (err, result) => {
    if (err) {
      fs.unlinkSync(`./public/uploads/vocabulary/${today}/${req.file.filename}`);
      return next(err);
    }
    if (!result) {
      return res.json({ message: errorCodes.UpdateFail });
    }
    fs.renameSync(`./public/uploads/vocabulary/${today}/${req.file.filename}`, `./public/uploads/vocabulary/${today}/${fileName}`, (err) => {
      if (err) {
        return next(err);
      }
    });
    return res.json({ message: "updateCompleted" });
  });
});

router.delete("/", (req, res, next) => {
  vocabularyModel.where().findOneAndRemove({ title: req.body.title }, (err, result) => {
    if (err) {
      return next(err);
    }
    if (!result) {
      return res.json({ errCode: errorCodes.RemoveFail });
    }
    return res.json({ message: "removeSuccessful" });
  });
});


// -------------------------

function changeFileName(req) {
  let fileName = req.body.title;
  if (req.file && req.file.fieldname === "image") {
    switch(req.file.mimetype) {
      case "image/jpeg":
        fileName += ".jpeg";
        break;
      case "image/jpg":
        fileName += ".jpg";
        break;
      case "image/png":
        fileName += ".png";
        break;
      case "image/gif":
        fileName += ".gif";
        break;
      default:
    }
  }
  return fileName;
}
