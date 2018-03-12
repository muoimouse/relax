// Vocabulary model

const mongoose = require("mongoose");
const schema   = mongoose.Schema;

const vocabularySchema = new schema({
  title: {
    type: String,
    unique: true
  },
  type: String,
  spelling: String,
  meaning: String,
  image: String
});
vocabularySchema.index({ title: 1 });
mongoose.model("Vocabulary", vocabularySchema);
