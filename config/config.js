const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'express-mongodb'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://mongodb/data-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'express-mongodb'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://mongodb/data-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'express-mongodb'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://mongodb/data-production'
  }
};

module.exports = config[env];
