//scraping modules
var request = require("request");
var cheerio = require("cheerio");

var mongojs = require("mongojs");
var mongoose = require("mongoose");

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/lnmNews");

//Require db model
var db = require("../models");

module.exports = function(app) {

  app.get("/", function(req, res) {
    res.render("home");
  });

    //Scrape the bbc website for top stories
    app.get("/scrape",function(req,result){
      request("http://www.bbc.com/news",function(error,res,html){
        var $=cheerio.load(html);
        
        $(".gs-c-promo").each(function(i,element){
          var image = $(this).find(".gs-c-promo-image img").attr("src");
          var link= $(this).find(".gs-c-promo-body a").attr("href");
          var heading= $(this).find(".gs-c-promo-heading__title").text();
          var summary= $(this).find(".gs-c-promo-summary").text();
          //  // Pass the data into a Handlebars object and then render it
          var article = {headline:heading,link:link,summary:summary,img:image}
          if (heading && link && summary){
            db.Headline.create(article)
              .then(function(dbHeadline){
              })
              .catch(function(err){
                // return res.json(err);
                console.log(err.message);
              })
          }
        });
        result.redirect('/articles');
      });
    });
  

    // Route for getting all Articles from the db
    app.get("/articles", function(req, res) {
      // Grab every document in the Articles collection
      db.Headline.find({})
        .then(function(data) {
          // If we were able to successfully find Articles, send them back to the client
            // res.json(data);
            var hbsObject = {items:data}
            res.render('scrape', hbsObject);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });

    app.get("/saved",function(req,res){
      db.Headline.find({issaved:true})
      .then(function(data){
        var hbsObject ={items:data}
        res.render('saved',hbsObject);
      })
    })
    
    app.post("/saved:id", function(req, res) {
     db.Headline.findById(req.params.id, function(err, data) {
        if (!data.issaved) {
          db.Headline.update({ _id: req.params.id }, {$set: {issaved: true}}, 
               function(err, data) {
            res.redirect("/saved");
          });
        }
        else {
          console.log("saved already");
        }
      });
    });
    
    app.post("/delete:id",function(req,res){
      console.log(req.params.id);
      db.Headline.remove({_id:req.params.id})
        .catch (function(err){
          res.json(err);
        })
        console.log("deleted");
        res.redirect("/saved");
    });

    app.post("/notes:id",function(req,res){
      db.Note.create(req.body)
        .then (function(dbNote){
          return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbHeadline) {
         // If we were able to successfully update an Article, send it back to the client
          res.json(dbHeadline);
        })
        .catch(function(err) {
         // If an error occurred, send it to the client
          res.json(err);
       });
});


  app.get("/deleteAll", function(req, res) {
    db.Headline.remove({})
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
      console.log("completed");
      res.redirect("/saved");
  });
}