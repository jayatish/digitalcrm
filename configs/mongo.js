"use strict";

const development = {
  port: 27017,
  host: "mongodb://localhost:27017/",
  db: "crm",
  chatHost: "mongodb://localhost:27017/",
  limit: 50,
  dbUri: 'mongodb+srv://jayatish:Passion@12345@cluster0.g73h9r2.mongodb.net/crm?retryWrites=true&w=majority'
  
};

const production = {
  port: 27017,
  //host: "mongodb://34.226.164.252:27017/",
  host: "mongodb://127.0.0.1:27017/",
  db: "crm",
  chatHost: "mongodb://127.0.0.1:27017/",
  limit: 50,
  dbUri: 'mongodb://127.0.0.1:27017/crm'
};

module.exports =
  process.env.NODE_ENV === "production" ? production : development;
