"use strict";

const development = {
  port: 27017,
  host: "mongodb://localhost:27017/",
  db: "crm",
  chatHost: "mongodb://localhost:27017/",
  limit: 50,
  // dbUri: 'mongodb://travelportal:travelportal@cluster0-shard-00-00-d2ofr.mongodb.net:27017,cluster0-shard-00-01-d2ofr.mongodb.net:27017,cluster0-shard-00-02-d2ofr.mongodb.net:27017/travelportal?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
  
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
