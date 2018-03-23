//scraping modules
var request = require("request");
var cheerio = require("cheerio");

var ObjectId = require('mongodb').ObjectId;

// mongoose.connect("mongodb://localhost/lnmNews");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/lnmNews";

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });

//Require db model
var db = require("../models");

module.exports = function(app) {
  
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
          link = "http://www.bbc.com/" + link;

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
}

