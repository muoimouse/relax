// Vocabulary model

const mongoose = require("mongoose");
const schema = mongoose.Schema;
const moment = require("moment");
let now = moment(moment.now().ISO_8601).format("YYYY/MM/DDThh:mm:ssZ");

const vocabularySchema = new schema({
  title: {
    type: String,
    unique: true,
    require: true
  },
  type: {
    type: String,
    enum: ["nouns", "adjectives", "adverbs", "verbs"],
    require: true
  },
  spelling: {
    type: String,
    require: true
  },
  meaning: {
    type: String,
    require: true
  },
  created: {
    type: String,
    default: now
  },
  image: String
});
vocabularySchema.index({ title: 1 });
mongoose.model("Vocabulary", vocabularySchema);
