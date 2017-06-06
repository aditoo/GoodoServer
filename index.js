"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://goodoadmin:goodoadmin@ds151141.mlab.com:51141/goodo";
const express = require("express");
const moment = require('moment');
const app = express();
const port = process.env.PORT || 8080;
const ObjectID = require('mongodb').ObjectID;

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
    //const currentTime = moment().utc().add('h', 3);
    collection.find({date: {$gt: "2017-06-04 19:12" }}).sort({"date": 1}).toArray((e, results) =>{
      db.close();
      if(e){
        console.error(e);
        return;
      }
      console.log(`Found ${results.legth} records that match the query.`);
      results.forEach(doc => console.log(`Doc title found - ${doc.title}`));
      const jsonStr = '{ "vol" : ' + JSON.stringify(results) + '}';
      const obj = JSON.parse(jsonStr);
      res.send(obj).end();
    });
  })

});

// create a new volunteer
app.post('/volunteers', function(req, res){
  const title = req.query.title;
  const minNumber = parseInt(req.query.minNumber);
  const maxNumber = parseInt(req.query.maxNumber);
  const currentNum = parseInt(req.query.currentNum);
  const address = req.query.address;
  const date = req.query.date;
  const duration = req.query.duration;
  const description = req.query.description;
  const imgName = req.query.imgName;
  const lastupdate = new Date();
  const vols = {};
  const toInsert = {
    "title": title,
    "minNumber" : minNumber,
    "maxNumber" : maxNumber,
    "currentNum" : currentNum,
    "address": address,
    "date" : date,
    "duration" : duration,
    "imgName" : imgName,
    "description" : description,
    "vols" : vols,
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
      const jsonStr = `{ "id" :  ${results.insertedId} }`;
      res.send(jsonStr).end();
    });
  })
  //res.send('Post volunteers was sent');
});

// create a new user
app.post('/users', function(req, res){
  const userName = req.query.userName;
  const phoneNumber = req.query.phoneNumber;
  const createdOn = new Date();
  const toInsert = {
    "userName": userName,
    "phoneNumber" : phoneNumber
  };

  MongoClient.connect(MONGO_URL, (err, db) =>{
    if(err){
      console.error(err);
      return;
    }
    const collection = db.collection('users');
    collection.insertOne(toInsert, (e ,results) => {
      db.close();
      if (e) {
        console.error(e);
        return;
      }
      const jsonStr = `{ "id" :  ${results.insertedId} }`;
      res.send(jsonStr).end();
    });
  })
});

// add user to a volunteer
app.put('/volunteers', function(req, res){
  const o_id = new ObjectID(req.query.id);
  console.log(o_id);
  MongoClient.connect(MONGO_URL, (err, db) =>{
    if(err){
      console.error(err);
      return;
    }
    const collection = db.collection('volunteers');
    collection.update({'_id' : o_id}, {$inc: {'currentNum' : 1}}, (e , results) =>{
      db.close();
      if(e){
        console.error(e);
        return;
      }
      res.send(results).end();
    });
  })
});

app.listen(port);
