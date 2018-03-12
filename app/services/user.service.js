"use strict";

const fs = require("fs");
const moment = require("moment");

let errorCodes = {
  InvalidInput: "InvalidInput",
  InvalidEmail: "InvalidEmail",
  InvalidPassword: "InvalidPassword",
  UpdateFail: "UpdateFail",
  SaveFail: "SaveFail",
  RemoveFail: "RemoveFail"
};

let messageCodes = {

};

let today = moment(moment.now().ISO_8601).format("YYYY-MM-DD");

module.exports = (userModel) => {
  return {
    get: (user, cb) => {
      userModel.find(user, (err, result) => {
        if (err) {
          return cb({ errCode: "getUserFail" });
        }
        return cb(result);
      });
    },
    saveUser: (user, file, cb) => {
      // validate
      if (!user) {
        return cb({ errCode: errorCodes.InvalidInput });
      }
      if (!user.email) {
        return cb({ errorCode: errorCodes.InvalidEmail });
      }
      if (!user.password) {
        return cb({ errorCode: errorCodes.InvalidPassword });
      }
  
      // change fileName
      let fileName = changeFileName(user, file);
      if (fileName !== user.email) {
        user.image = today + "/" + fileName;
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
          fs.renameSync(`./public/uploads/user/${today}/${file.filename}`, `./public/uploads/user/${user.image}`);
        }
        return cb({ message: "saveCompleted" });
      });
    }
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
