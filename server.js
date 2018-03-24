//Dependencies
var express = require("express");
var bodyParser = require("body-Parser");
var logger = require("morgan");
var mongojs = require("mongojs");
var mongoose = require("mongoose");

var PORT = 3000;

var app= express();

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/lnmNews";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(express.static("pubic"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================

require("./routes/Scrape.js")(app);
require("./routes/Viewroutes.js")(app);
require("./routes/postroutes.js")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================

  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
