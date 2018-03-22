// User model

const mongoose = require("mongoose");
const schema   = mongoose.Schema;
const moment = require("moment");
// const bcrypt = require("bcrypt-nodejs");
let now = moment(moment.now().ISO_8601).format("YYYY/MM/DDThh:mm:ssZ");

const userSchema = new schema({
  email: {
    type: String,
    unique: true,
    require: true
  },
  name: {
    type: String,
    default: "anonymous"
  },
  password: {
    type: String,
    min: 8,
    max: 16,
    require: true,
  },
  type: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  },
  created: {
    type: String,
    default: now
  },
  image: {
    type: String,
    default: "user/admin.jpeg"
  },
  token: {
    type: String
  }
});

userSchema.index({ email: 1 });

let userModel = mongoose.model("User", userSchema);

let user = {
  email: "admin@admin.com",
  name: "admin",
  password: "admin",
  type: "admin",
};
userModel.findOne({ email: user.email }, (error, result) => {
  if (error) {
    throw error;
  }
  if (!result) {
    let userDefault = new userModel(user);
    return userModel.create(userDefault);
  }
});


