"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://goodoadmin:goodoadmin@ds151141.mlab.com:51141/goodo";
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

/*
MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }
   let collection = db.collection('volunteers');
   collection.insertMany([
      {username: "foo" , number: 100},
      {username: "bar", number: 200},
      {username: "something", number: 300}
   ], (err, results) => {
          console.log(results);
          db.close();
          if (err) {
              console.error(err);
              return;
            }
          console.log(`Completed successfully, inserted ${results.insertedCount} documents`);
      });
});*/


// get volunteers for main view
app.get('/volunteers' , function(req ,res){
  MongoClient.connect(MONGO_URL, (err, db) =>{
    if(err){
      console.error(err);
      return;
    }
    const collection = db.collection('volunteers');
    collection.find().toArray((e, results) =>{
      db.close();
      console.log(`Found ${results.legth} records that match the query.`);
      results.forEach(doc => console.log(`Doc title found - ${doc.title}`));
    });
  })
  res.send('GET volunteers was sent');
});

// create a new volunteer
app.post('/volunteers', function(req, res){
  const title = req.query.title;
  const minNumber = parseInt(req.query.minNumber);
  const maxNumber = parseInt(req.query.maxNumber);
  const address = req.query.address;
  const time = req.query.time;
  const date = req.query.date;
  const duration = req.query.duration;
  const description = req.query.description;
  const lastupdate = new Date();
  const toInsert = {
    "title": title,
    "minNumber" : minNumber,
    "maxNumber" : maxNumber,
    "address": address,
    "time" : time,
    "date" : date,
    "duration" : duration,
    "description" : description,
    "lastupdate" : lastupdate
  };

  MongoClient.connect(MONGO_URL, (err, db) =>{
    if(err){
      console.error(err);
      return;
    }
    const collection = db.collection('volunteers');
    collection.insertOne(toInsert, (e ,results) => {
      db.close();
      if (e) {
        console.error(e);
        return;
      }
      console.log(`Inserted successfully ${results.title}`);
    });
  })
  res.send('Post volunteers was sent');
});

app.listen(port);