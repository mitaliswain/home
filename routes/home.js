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
module.exports = router;
