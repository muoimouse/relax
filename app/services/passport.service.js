const passport = require("passport");
const passportJWT = require("passport-jwt");
const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: "relaxWebAPI",
};

passport.use(new JwtStrategy(jwtOption, (jwt_payload, done) => {
  userModel.findOne({ email: jwt_payload.email }, (err, results) => {
    if (err) {
      return done(err, false);
    }
    if (results) {
      return done(null, results);
    }
    return done(null, false);
  });
}));

module.exports = passport;
