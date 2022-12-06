var appRoot = require('app-root-path');
var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: false,
    json: true,
    format: winston.format.combine(
      winston.format.combine(),
      winston.format.timestamp(),
      winston.format.json()),
  },
  fileError: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    format: winston.format.combine(
      winston.format.combine(),
      winston.format.timestamp(),
      winston.format.json()),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    //format: winston.format.simple(winston.format.colorize())
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.align(),
      winston.format.simple())
  },
};

const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    sql: 4,
    debug: 5
  },
  colors: {
    error: "red",
    warn: "darkred",
    info: "black",
    http: "green",
    sql: "blue",
    debug: "gray"
  }
};

winston.addColors(logLevels);

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.fileError),
      //new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console(options.console));
}

module.exports = logger;