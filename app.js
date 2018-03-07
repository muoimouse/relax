const express = require("express");
const config = require("./config/config");
const glob = require("glob");
// const multer = require("multer");
const mongoose = require("mongoose");

mongoose.connect(config.db);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", () => {
    throw new Error("unable to connect to database at " + config.db);
});

const models = glob.sync(config.root + "/app/models/*.js");
models.forEach(function (model) {
    require(model);
});
const app = express();
// app.set(multer({ dest: "./public/uploads/" }));
// app.use(multer({ dest: "./public/uploads/" }).any());
// / app.use(bodyParser({
//     uploadDir: path.join((__dirname, "../public/upload/temp"))
// }));

module.exports = require("./config/express")(app, config);

app.listen(config.port, () => {
    console.log("Express server listening on port " + config.port);
});

