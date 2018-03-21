var mongojs = require("mongojs");
var mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/lnmNews");

//Require db model
var db = require("../models");

module.exports = function(app) {

        // Route for getting all Articles from the db
        app.get("/", function(req, res){
          // Grab every document in the Articles collection
          db.Headline.find({})
            .then(function(data) {
                var hbsObject = {items:data}
                res.render('index', hbsObject);
            })
            .catch(function(err) {
              // If an error occurred, send it to the client
              res.json(err);
            });
        });
          
          
        app.get("/index", function(req, res) {
            res.redirect("/");
          });

        //Route for getting all saved articles 
        app.get("/saved",function(req,res){
          db.Headline.find({issaved:true})
            .then(function(data){
                  var hbsObject = {items: data};
                  res.render('saved',hbsObject);
                })
        });

            //get note 
            app.get("/addnote/:id", function(req,res){
              console.log("I click on add notes button");
              db.Note.find({articleid:req.params.id})
              // db.Headline.findOne({_id:req.params.id})
                .then(function(dataNotes){
                    var hbsObject ={note:dataNotes};
                    console.log("Data from Notes" ,hbsObject);
                    location.reload('notescontainer',hbsObject);
              }) 
              .catch(function(err){
                res.json(err);
              });       
            });


        // To Clean Out the db during testing

        app.get("/deleteAll", function(req, res) {
          db.Headline.remove({})
            .catch(function(err) {
              res.json(err);
            });
            console.log("completed");
            res.redirect("/saved");
        });


  }
