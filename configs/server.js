"use strict";

var module, exports;

var development = {
  // baseUrl: "http://192.168.0.143:8000",
  baseUrl: "https://devinvoiceapp.dawsllp.com",
  httpPort: 8030,
  httpsPort: 8030,
  appName: "Invoice App",
  email: "jayatish@digitalaptech.com",
  errorLog: "./error.log",
  audience: "InvoiceApp",
  issuer: "DigitalAptech"
};

// var development = {
//   baseUrl: "https://nodejsdapldevelopments.com:8100",
//   httpPort: 8100,
//   httpsPort: 8100,
//   appName: "Invoice App",
//   email: "jayatish@digitalaptech.com",
//   errorLog: "./error.log",
//   audience: "InvoiceApp",
//   issuer: "DigitalAptech"
// };

var production = {
  baseUrl: "https://devinvoiceapp.dawsllp.com",
  httpPort: 8030,
  httpsPort: 8030,
  appName: "Invoice App",
  email: "jayatish@digitalaptech.com",
  errorLog: "./error.log",
  audience: "InvoiceApp",
  issuer: "DigitalAptech"
};
var server = process.env.NODE_ENV === "production" ? production : development;
module.exports = server;
