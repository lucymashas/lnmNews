//Dependencies
var express = require("express");
var bodyParser = require("body-Parser");
var logger = require("morgan");

var PORT = 3000;

var app= express();

	// Serve static content for the app from the "public" directory
  app.use(express.static("./public"));

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
