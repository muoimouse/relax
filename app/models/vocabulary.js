// Vocabulary model

const mongoose =  require("mongoose");
const Schema = mongoose.Schema;
// const moment = require("moment");

// let now = moment(moment.now().ISO_8601).format();
const VocabularySchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    type: String,
    spelling: String,
    meaning: String,
    image: String
});
VocabularySchema.virtual("date")
    .get(() => this._id.getTimestamp());
mongoose.model("Vocabulary", VocabularySchema);
