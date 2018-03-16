"use strict";

const fs = require("fs");
const moment = require("moment");
const validator = require("validator");

let errorCodes = {
  InvalidInput: "InvalidInput",
  InvalidEmail: "InvalidEmail",
  InvalidPassword: "InvalidPassword",
  UpdateFail: "UpdateFail",
  SaveFail: "SaveFail",
  RemoveFail: "RemoveFail",
  GetFail: "GetFail",
};

let messageCodes = {
  SaveSuccessful: "SaveSuccessful",
  UpdateSuccessful: "UpdateSuccessful",
  DeleteSuccessful: "DeleteSuccessful",
};

let today = moment(moment.now().ISO_8601).format("YYYY-MM-DD");

module.exports = (userModel) => {
  return {
    /**
     * @function getUser
     * @param user
     * @param cb
     * @return object
     */
    getUser: (user, cb) => {
      userModel.find(user, (err, result) => {
        if (err) {
          return cb({ errCode: errorCodes.GetFail });
        }
        return cb(result);
      });
    },
    /**
     * @function saveUser
     * @param user
     * @param file
     * @param cb
     * @return object
     */
    saveUser: (user, file, cb) => {
      console.log(file);
      // validate
      if (!user) {
        return cb({ errCode: errorCodes.InvalidInput });
      }
      if (!user.email || !validator.isEmail(user.email)) {
        return cb({ errorCode: errorCodes.InvalidEmail });
      }
      if (!user.password) {
        return cb({ errorCode: errorCodes.InvalidPassword });
      }
      if (!user.name) {
        let email = user.email;
        user.name = email.substring(0, email.indexOf("@"));
      }

      // change fileName
      let fileName = changeFileName(user, file);
      if (fileName !== user.email) {
        user.image = "user"+ "/" + today + "/" + fileName;
      }

      let saveUser = new userModel(user);
      saveUser.save((err) => {
        if (err) {
          if (file) {
            fs.unlinkSync(`./public/uploads/user/${today}/${file.filename}`);
          }
          return cb({ errCode: errorCodes.SaveFail });
        }
        if (file) {
          fs.renameSync(`./public/uploads/user/${today}/${file.filename}`, `./public/uploads/${user.image}`);
        }
        return cb({ message: messageCodes.SaveSuccessful });
      });
    },
    /**
     * @function updateUser
     * @param user
     * @param file
     * @param cb
     */
    updateUser: (user, file, cb) => {
      // Validate email is exist;
      if (!user.email || !validator.isEmail(user.email)) {
        return cb({ errCode: errorCodes.InvalidEmail });
      }

      // Update fileName
      let fileName = changeFileName(user, file);
      if (fileName !== user.email) {
        user.image = "user" + "/" + today + "/" + fileName;
      }

      userModel.where().findOneAndUpdate({email: user.email}, {$set: user}, (err) => {
        if (err) {
          if (file) {
            fs.unlinkSync(`./public/uploads/user/${today}/${file.filename}`);
          }
          return cb({ errCode: errorCodes.UpdateFail });
        }
        if (file) {
          fs.renameSync(`./public/uploads/user/${today}/${file.filename}`, `./public/uploads/${user.image}}`);
        }
        return cb({ message: messageCodes.UpdateSuccessful });
      });
    },

    deleteUser: (user, cb) => {
      let email = user.email;
      if (!email || !validator.isEmail(email)) {
        return cb({ errCode: errorCodes.InvalidEmail });
      }

      userModel.findOne({email: email}, (err, result) => {
        if (err || !result || result.type === "admin") {
          return cb({errCode: errorCodes.RemoveFail});
        }
        userModel.where().findOneAndRemove({email: email}, (err, result) => {
          if (err || !result) {
            return cb({ errCode: errorCodes.RemoveFail });
          }
          return cb({ message: messageCodes.DeleteSuccessful });
        });
      });
    },
  };
};


//-------------------------------

function changeFileName(user, file) {
  let fileName = user.email;
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
