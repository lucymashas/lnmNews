//Dependencies
var express = require("express");
var bodyParser = require("body-Parser");
var mongojs = require("mongojs");
var logger = require("morgan");
var mongoose = require("mongoose");
//Mongoose mpromise deprecated - use bluebird promises
var Promise = require ("bluebird");

//scraping modules
var request = require("request");
var cheerio = require("cheerio");

//Require db model
var db = require("./models")

var app= express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(express.static("pubic"));

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/lnmNews")
var db = mongoose.connection;

db.on("error",function(error){
  console.log("Mongoose Error: ",error);
});

//Once logged in to the db provide a successful message
db.once("open", function(){
  console.log("Connection Successful");
})

//Scrape the bbc website for top stories
app.get("/scrape",function(req,result){
  request("http://www.bbc.com/news",function(error,res,html){
    var $=cheerio.load(html);

    $(".gs-c-promo-heading","div").each(function(i,element){

      var link= $(element).attr("href");
      var heading= $(element).text();
      var summary= $('.gs-c-promo-summary','div').text();
      
        if (heading && link && summary){
          db.Headline.save({
            headline: heading,
            link: link,
            summary: summary
          },
          function(error,saved){
            if (error){
              console.log(error);
            }else{
              console.log(saved);
            }
          });
        }
    });
    result.send("Scrape Complete");
  });
});

app.get("/headline",function(err,result){
  db.Headline.find({},function(error,items){
    if (error){
      console.log("Error Found: ",error);
    }else{
      result.json(items);
    }
  });
});


app.listen(3000,function(){
  console.log("App running on port 3000!");
})