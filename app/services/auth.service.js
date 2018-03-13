const jwt = require("jsonwebtoken");

const errorCodes = {
  InvalidEmail: "InvalidEmail",
  InvalidPassword: "InvalidPassword",
  LoginFail: "LoginFail",
};

const secretOrKey = "relaxWebAPI";

const messageCodes = {
  LoginSuccessful: "LoginSuccessful",
};

module.exports = (userModel) => {
  return {
    login: (user, cb) => {
      let email = user.email;
      let password = user.password;
      if (!email) {
        return cb({ errCode: errorCodes.InvalidEmail });
      }
      if (!password) {
        return cb({ errCode: errorCodes.InvalidPassword });
      }
      
      userModel.findOne({ email: email }, (err, results) => {
        if (err || !results) {
          return cb({ errCode: errorCodes.LoginFail });
        }
        if (results.password !== password) {
          return cb({ errCode: errorCodes.InvalidPassword });
        }
        let payload = { email: results.email };
        let token = jwt.sign(payload, secretOrKey);
        return cb({ message: messageCodes.LoginSuccessful, token: token });
      });
    }
  };
};
