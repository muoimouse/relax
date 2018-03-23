const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "production";

const config = {
  development: {
    root: rootPath,
    domain: "relax.xxx",
    app: {
      name: "relax"
    },
    port: process.env.PORT || 3000,
    uploadDir: "./public/uploads/",
    db: "mongodb://mongodb/data_development"
  },

  test: {
    root: rootPath,
    app: {
      name: "relax"
    },
    port: process.env.PORT || 3000,
    db: "mongodb://mongodb/data_test"
  },

  production: {
    root: rootPath,
    app: {
      name: "relax"
    },
    port: process.env.PORT || 3000,
    db:
      "mongodb://muoimouse:0p0p1wwm@relax-shard-00-00-2ibkv.mongodb.net:27017,relax-shard-00-01-2ibkv.mongodb.net:27017,relax-shard-00-02-2ibkv.mongodb.net:27017/test?ssl=true&replicaSet=relax-shard-0&authSource=admin"
  }
};

module.exports = config[env];
