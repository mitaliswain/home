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


router.get('/', function(req, res, next) {


  var findExpense = function(week, db, callback) {
     var docs  = []
     var cursor =db.collection('home').find({"week":parseInt(week)});
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

  var week = req.query.week;
  MongoClient.connect(url, function(err, db) {
      if(err){
        res.send('Error in connection!');
      }
      else{
        findExpense(week, db, function(docs) {
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

router.put('/:id', function(req, res, next){

   var updatehome = function(id, expense, db, callback) {
   //console.log(filterOptions);
   db.collection('home').update(
     {"_id": ObjectId(id)},
     { $set: { "total_expense_amount": expense} }, function(err, results) {
        if (err) {
          console.log(err);
        }
      callback();
   });
};

//var filterOptions  = {}
//var josnToUpdate = req.body;

//filterOptions.name = req.query.name;
//filterOptions.borough = req.query.borough;

//console.log(filterOptions.name);
var id = req.params.id;
var expense = req.body.total_expense_amount;
MongoClient.connect(url, function(err, db) {
  if(err){
    res.send('Error in connection!');
  }
  else{
    updatehome(id, expense, db, function() {
        db.close();
        res.send('updated..')
    });
  }
});

})

router.put('/', function(req, res, next){

   var updatehome = function(week, expense, db, callback) {
   console.log(parseInt(week))
   db.collection('home').updateMany(
    {"week":parseInt(week)},
    {$set: { "total_expense_amount": expense}},

     function(err, results) {
        if (err) {
          console.log(err);
        }
      callback();
   });
};
var expense = req.body.total_expense_amount;
var week = req.query.week;
MongoClient.connect(url, function(err, db) {
  if(err){
    res.send('Error in connection!');
  }
  else{
    updatehome(week, expense, db, function() {
        db.close();
        res.send('updated..')
    });
  }
});

})
router.delete('/', function(req, res, next) {

  var removehome = function(week,db, callback) {
     db.collection('home').deleteMany(
        {"week":parseInt(week)},
        function(err, results) {
           console.log(err);
           callback();
        }
     );
  };

  var week = req.query.week;
  MongoClient.connect(url, function(err, db){

    if(err){
      res.send('Error in connection');
    }
    else{
      removehome(week,db, function() {
      res.send('deleted..');
      db.close();
      });
    }
  })

})




module.exports = router;
