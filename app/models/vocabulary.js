// Vocabulary model

const mongoose = require("mongoose");
const schema   = mongoose.Schema;

const vocabularySchema = new schema({
  title: {
    type: String,
    unique: true,
    require: true,
  },
  type: {
    type: String,
    enum: ["nouns", "adjectives", "adverbs", "verbs"],
    require: true,
  },
  spelling: {
    type: String,
    require: true,
  },
  meaning: {
    type: String,
    require: true,
  },
  image: String
});
vocabularySchema.index({ title: 1 });
mongoose.model("Vocabulary", vocabularySchema);
