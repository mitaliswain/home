var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://mitalis:mitali123@ds036577.mlab.com:36577/crud';

router.get('/:id', function(req, res, next) {


  var findExpense = function(id, db, callback) {
     var docs  = []
     var cursor =db.collection('home').find({"_id": ObjectId(id)});
     cursor.each(function(err, doc) {
        if(err){
          res.send('Error in finding data!');
        }
        if (doc != null) {
            docs.push(doc);

        } else {
           callback(docs);
        }
     });

  };

  var id = req.params.id
  console.log(id);
  MongoClient.connect(url, function(err, db) {
      if(err){
        res.send('Error in connection!');
      }
      else{
        findExpense(id, db, function(docs) {
          res.send(docs);
          db.close();
        });
      }

  });
});

router.post('/', function(req, res, next) {

  var insertDocument = function(json, db, callback) {
     db.collection('home').insertOne( json,
     function(err, result) {
      console.log("Inserted a document into the restaurants collection.");
      console.log(result.insertedId);
      callback(result.insertedId);
    });
  };

  var json = req.body
  MongoClient.connect(url, function(err, db) {
    if(err){
      res.send('Error in connection!');
    }
    else{
      insertDocument(json, db, function(id) {
            db.close();
            res.send( "http://"+req.headers.host+'/home/'+ id )
          });
    }
  });
})

module.exports = router;
