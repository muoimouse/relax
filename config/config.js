const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";

const config = {
    development: {
        root: rootPath,
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
        db: "mongodb://mongodb/data_production"
    }
};

module.exports = config[env];
