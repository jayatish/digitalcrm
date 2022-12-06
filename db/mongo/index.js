'use strict';

const mongoose = require('mongoose')
  , logger = require('../../configs/logger');

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
let db;
/*****************************************
 *    CONNECTING MONGODB USING MONGOOSE  *
 *****************************************/
const connect = (address, options) => {
  console.log("address ==> ", address);
  db = mongoose.connect(address, {
    useCreateIndex: true,
    useNewUrlParser: true
  });
  return new Promise((resolve, reject) => {
    mongoose.connection.once('open', () => {
      require('./schema');
      logger.info("Database Connected");
      resolve();
    });
    mongoose.connection.on('error', (err) => {
      if (err) {
        logger.error("Database Connection Error: ", err);
        reject(err);
      }
    });
  });
};

/**************************************
 *  RETURNS MONGOOSE INSTANCE         *
 **************************************/
const dbInstance = () => {
  if (mongoose.connection.readyState !== 1) {
    return null;
  } else {
    return db;
  }
};

module.exports = {
  connect: connect,
  dbInstance: dbInstance
}