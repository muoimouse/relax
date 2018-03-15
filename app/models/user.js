// User model

const mongoose = require("mongoose");
const schema   = mongoose.Schema;
const moment = require("moment");
let now = moment(moment.now().ISO_8601).format();

const userSchema = new schema({
  email: {
    type: String,
    unique: true,
    require: true
  },
  name: {
    type: String,
    default: "XXX"
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
    type: String
  },
  token: {
    type: String
  }
});

userSchema.index({ email: 1 });

let userModel = mongoose.model("User", userSchema);

let user = {
  email: "admin@admin.com",
  password: "admin",
  type: "admin"
};
userModel.findOne(user, (error, result) => {
  if (error) {
    throw error;
  }
  if (!result) {
    let userDefault = new userModel(user);
    userModel.create(userDefault);
  }
});


