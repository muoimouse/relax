"use strict";

const fs = require("fs");
const moment = require("moment");

let errorCodes = {
  InvalidTitle: "InvalidTitle",
  InvalidType: "InvalidType",
  InvalidSpelling: "InvalidSpelling",
  InvalidMeaning: "InvalidMeaning",
  UpdateFail: "UpdateFail",
  SaveFail: "SaveFail",
  DeleteFail: "DeleteFail",
  GetFail: "GetFail",
};

let messageCodes = {
  SaveSuccessful: "SaveSuccessful",
  UpdateSuccessful: "UpdateSuccessful",
  DeleteSuccessful: "DeleteSuccessful",
};

let today = moment(moment.now().ISO_8601).format("YYYY-MM-DD");

module.exports = (vocabularyModel) => {
  return {

    /**
     * @function getVocabulary
     * @param vocabulary
     * @param cb
     */
    getVocabulary: (vocabulary, cb) => {
      vocabularyModel.find(vocabulary, (err, results) => {
        if (err) {
          return cb({errCode: errorCodes.GetFail});
        }
        return cb(results);
      });
    },

    /**
     * @function saveVocabulary
     * @param vocabulary
     * @param file
     * @param cb
     */
    saveVocabulary: (vocabulary, file, cb) => {
      if (!vocabulary || !vocabulary.title) {
        return cb({errCode: errorCodes.InvalidTitle});
      }
      if (!vocabulary.type) {
        return cb({errCode: errorCodes.InvalidType});
      }
      if (!vocabulary.spelling) {
        return cb({errCode: errorCodes.InvalidSpelling});
      }
      if (!vocabulary.meaning) {
        return cb({errCode: errorCodes.InvalidMeaning});
      }

      // change fileName
      let fileName = changeFileName(vocabulary, file);
      if (fileName !== vocabulary.title) {
        vocabulary.image = "vocabulary" + "/" + today + "/" + fileName;
      }

      let saveVocabulary = new vocabularyModel(vocabulary);
      saveVocabulary.save((err) => {
        if (err) {
          if (file) {
            fs.unlinkSync(`./public/uploads/vocabulary/${ today }/${ file.filename }`);
          }
          return cb({errCode: errorCodes.SaveFail});
        }
        if (file) {
          fs.renameSync(`./public/uploads/vocabulary/${ today }/${ file.filename }`, `./public/uploads/${ vocabulary.image }`);
        }
        return cb({message: messageCodes.SaveSuccessful});
      });
    },

    /**
     * @function updateVocabulary
     * @param vocabulary
     * @param file
     * @param cb
     */
    updateVocabulary: (vocabulary, file, cb) => {
      if (!vocabulary.title) {
        return cb({errCode: errorCodes.InvalidTitle});
      }

      //  update fileName
      let fileName = changeFileName(vocabulary, file);
      if (fileName !== vocabulary.title) {
        vocabulary.image = "vocabulary" + "/" + today + "/" + fileName;
      }

      vocabularyModel.where().findOneAndUpdate({title: vocabulary.title}, {$set: vocabulary}, (err) => {
        if (err) {
          if (file) {
            fs.unlinkSync(`./public/uploads/vocabulary/${ today }/${ file.filename }`);
          }
          return cb({errCode: errorCodes.UpdateFail});
        }
        if (file) {
          fs.renameSync(`./public/uploads/vocabulary/${ today }/${ file.filename }`, `./public/uploads/${ vocabulary.image }`);
        }
        return cb({message: messageCodes.UpdateSuccessful});
      });
    },
    deleteVocabulary: (vocabulary, cb) => {
      let title = vocabulary.title;
      if (!title) {
        return cb({ errCode: errorCodes.InvalidTitle });
      }

      vocabularyModel.where().findOneAndRemove({ title: title }, (err, result) => {
        if (err) {
          return cb({ errCode: errorCodes.DeleteFail });
        }
        if (!result) {
          return cb({ errCode: errorCodes.DeleteFail });
        }
        return cb({ message: messageCodes.DeleteSuccessful });
      });
    }
  };
};

// -------------------------
/**
 * @function changeFileName
 * @param { any } vocabulary
 * @param { any } file
 */
function changeFileName(vocabulary, file) {
  let fileName = vocabulary.title;
  if (file && file.fieldname === "image") {
    switch (file.mimetype) {
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
