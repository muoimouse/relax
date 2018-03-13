const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const vocabularyModel = mongoose.model("Vocabulary");
const vocabularyService = require("../services/vocabulary.service")(vocabularyModel);
const moment = require("moment");
const multer = require("multer");


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

router.get("/", (req, res) => {
  vocabularyService.getVocabulary(req.body, (results) => {
    return res.json(results);
  });
});

router.put("/", upload.single("image"), (req, res) => {
  vocabularyService.updateVocabulary(req.body, req.file, (results) => {
    return res.json(results);
  });
});

router.post("/", upload.single("image"), (req, res) => {
  vocabularyService.saveVocabulary(req.body, req.file, (results) => {
    return res.json(results);
  });
});

router.delete("/", (req, res) => {
  vocabularyService.deleteVocabulary(req.body, (results) => {
    return res.json(results);
  });
});


