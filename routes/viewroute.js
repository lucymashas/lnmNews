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

    //Scrape the bbc website for top stories
    app.post("/scrape",function(req,result){
      request("http://www.bbc.com/news",function(error,res,html){

        var $=cheerio.load(html);
        
        $(".gs-c-promo").each(function(i,element){
          var image=$(this).find(".gs-o-responsive-image img").attr("data-src");
          if (!image){
            image=('assets/images/image-placeholder.png');
          }
          var link= $(this).find(".gs-c-promo-body a").attr("href");
          var heading= $(this).find(".gs-c-promo-heading__title").text();
          var summary= $(this).find(".gs-c-promo-summary").text();
        //replacing {width} in the image string
        image = image.replace("{width}",240);

       // Pass the data into a Handlebars object and then render it
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
        result.redirect("/");
      });
    });
  

   

//Route for getting all saved articles
    app.get("/saved",function(req,res){
      db.Headline.find({issaved:true})
      .then(function(data){
        var hbsObject ={items:data}
        res.render('saved',hbsObject);
      });
    });
    
//Route for saving an article
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
    
  //Route for deleting a save article  
    app.post("/delete:id",function(req,res){
      db.Headline.remove({_id:req.params.id})
        .catch (function(err){
          res.json(err);
        })
        console.log("deleted");
        res.redirect("/saved");
    });



// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles:id", function(req, res) {
  // Using the id passed in the id parameter
    db.Headline.findOne(req.params.id)
    //mongoose populate notes
      .populate("note")
      .then(function(dbHeadline) {
      var hbsObject ={notes:data}
      res.render('saved',hbsObject);
    });
  });


    app.post("/submitNote:id",function(req,res){
      db.Note.create(req.body)
        .then (function(dbNote){
        db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbHeadline) {
          res.redirect("/saved");
        })
        .catch(function(err) {
         // If an error occurred, send it to the client
          res.json(err);
       });
});

// To Clean Out the db during testing

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