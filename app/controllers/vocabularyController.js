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
let today = moment(moment.now()).format("YYYY-MM-DD");

// Set up upload file with multer
let imageFilter = (req, file, cb) => {
    if ("image/jpeg" && "image/jpg" && "image/png" !== file.mimetype && file.size > 2000000) {
        return cb(null, false);
    }
    return cb(null, true);
};
let upload = multer({ dest: `./public/uploads/${today}/`, fileFilter: imageFilter });


module.exports = (app) => {
    app.use("/vocabulary", router);
};

router.get("/all", (req, res, next) => {
    vocabularyModel.find((err, result) => {
        if (err) {
            return next(err);
        }
        return res.json(result);
    });
});

router.get("/", (req, res, next) => {
    if (!Object.keys(req.query).length) {
        return res.json({ errCode: errorCodes.InvalidParameter });
    }
    vocabularyModel.findOne(req.query, (err, result) => {
        if (err) {
            return next(err);
        }
        return res.json(result);
    });
});

router.put("/", upload.single("image"), (req, res, next) => {
    let vocabulary = new vocabularyModel(req.body);
    vocabulary.save((err) => {
        if (err) {
            fs.unlinkSync(`./public/uploads/${today}/${req.file.filename}`);
            return next(err);
        }
        if (req.file && req.file.filename === "image") {
            fs.renameSync(`./public/uploads/${today}/${req.file.filename}`, `./public/uploads/${today}/${updateData.title}`, (err) => {
                if (err) {
                    return next(err);
                }
            });
        }
        return res.json({ message: "saveCompleted" });
    });
});

router.post("/", upload.single("image"), (req, res, next) => {
    let updateData = req.body;
    
    // Check existence of title in req.body
    if (!updateData.title) {
        return next(new Error(errorCodes.InvalidVocabularyTitle));
    }
    
    // Check existence of file upload
    if (req.file && req.file.fieldname === "image") {
        updateData.image = today + "/" +req.body.title;
    }
    vocabularyModel.where().findOneAndUpdate({ title: req.body.title }, { $set: updateData }, (err, result) => {
        if (err) {
            fs.unlinkSync(`./public/uploads/${today}/${req.file.filename}`);
            return next(err);
        }
        if (!result) {
            res.json({ message: errorCodes.UpdateFail });
        }
        fs.renameSync(`./public/uploads/${today}/${req.file.filename}`, `./public/uploads/${today}/${updateData.title}`, (err) => {
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
            return res.json({ message: "notFound" });
        }
        return res.json({ message: "deleteSuccessful" });
    });
});
