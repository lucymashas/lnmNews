var mongojs = require("mongojs");
var mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/lnmNews");

//Require db model
var db = require("../models");

module.exports = function(app) {

    // Route for saving an article - Save the article and redirect to the save page
    app.post("/saved:id", function(req, res){
      db.Headline.findById(req.params.id, function(err, data){
        if (!data.issaved){
          db.Headline.update({ _id: req.params.id }, {$set: {issaved: true}}, 
            function(err, data) {
            res.redirect("/saved");
          });
        }
        else{
          console.log("saved already");
        }
      });
    });

    //add note
    app.post("/submitNote:id",function(req,res){
      db.Note.create(req.body)
        .then (function(dbNote){
          res.redirect("/saved");
        })
        .catch(function(err) {
          res.json(err);
      });
    });


 //Route for deleting a save article  
    app.post("/delete:id",function(req,res){
      db.Headline.update({ _id: req.params.id }, {$set: {issaved: false}}) 
        .catch(function(err){
          console.log(err);
        });
        console.log('removed');
        res.redirect("/saved");
      });

 //Route for deleting a save article  
        app.post("/delete:id",function(req,res){
              db.Headline.update({ _id: req.params.id }, {$set: {issaved: false}}) 
                .catch(function(err){
                  console.log(err);
                });
                console.log('removed');
                res.redirect("/saved");
              });

}