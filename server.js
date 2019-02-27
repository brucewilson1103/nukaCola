var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/SWeather"

mongoose.connect( MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website article
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.spaceweather.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    const neoArr = [];
    // Now, we grab every h2 within an Neo tag, and do the following:
    $("td font").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      neoArr.push(result);
    //  NeoArr    webmaster@ssd.jpl.nasa.gov
    });

    db.Neo.create(neoArr)
      .then(() => res.send("Scrape Complete"))
      .catch(err => {
        console.log(err);
        res.json(err);
      })

  });
});

// Route for getting all Neos from the db
app.get("/neo", function (req, res) {
  // Grab every document in the Neos collection
  db.Neo.find({title: {$exists: true}, $where: "this.title.length < 12"})
    .then(function (dbNeo) {
      // If we were able to successfully find Neos, send them back to the client
      res.json(dbNeo);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Neo by id, populate it with it's note
app.get("/neo/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Neo.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbNeo) {
      // If we were able to successfully find an Neo with the given id, send it back to the client
      res.json(dbNeo);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Neo's associated Note
app.post("/neo/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Neo.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbNeo) {
      // If we were able to successfully update an Neo, send it back to the client
      res.json(dbNeo);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
