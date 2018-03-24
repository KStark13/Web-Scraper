// Set up packages used
var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");
var logger = require("morgan");

//Require all models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

//Define Port
var PORT = process.env.PORT || 3000;

//Initialize express
var app = express();

//Configure Middleware
//Use morgan logger for logging requests
app.use(logger("dev"));
//use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: false}));

//use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");





//Connect to Mongo DB
mongoose.Promise = Promise

//database configuration with mongoose
mongoose.connect("mongodb://localhost:27017/web-scraper")
/*mongoose.connect("mongodb://heroku_3zqcjk5x:n27l8aat7khn49hraj73l503gg@ds117759.mlab.com:17759/heroku_3zqcjk5x");
*/
var db = mongoose.connection;
//show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

//once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.")
});

//ROUTES
//Routes to render handlebars pages
app.get("/",function(req,res){
	Article.find({"saved": false}, function(error, date) {
		var hbsObject = {
			article: data
		};
		console.log(hbsObject);
		res.render("home", hbsObject)
	});
});

app.get("/saved", function(req,res) {
	Article.find({"saved": true}).populate("notes").exec(function(error, articles) {
		var hbsObject = {
			article: articles
		};
		res.render("saved", hbsObject)
	})
})
//A GET route for scraping the New York Times website
app.get("/scrape", function(req, res){
	request("http://nytimes.com", function (error, response, html) {
		//We load that into cheerio and save to $ for a shorthand selector
		var $ = cheerio.load(html);
		//Grab every h2 within an article tag
		$("article").each(function(i, element){
			//Save an empty result object
			var result = {};
			//Add the title and link, and save them as properties of result object
			result.title = $(this).children("h2").text();
			result.summary = $(this).children("summary").text();
			result.link = $(this).children("h2").children("a").attr("href");

			//Use the Article model, create a new entry
			var entry = new Article(result);

			//Save entry to the db
			entry.save(function(err, doc){
				//Log errors
				if(err) {
					console.log(err);
				} else{
					console.log(doc);
				}
			});
		});
		//If we successfully scrape and save an article, send a message to the client
		res.send("Scrape Complete");
	});
});

//Route for getting all Articles from the db
app.get("/articles", function(req, res) {
	//Grab every document in the Articles collection
	db.Article
		.find({})
		.then(function(dbArticle) {
			//If we were able to successfully find Articles, send them back to the client
			res.json(dbArticle);
		})
		.catch(function(err) {
			//If an error occured, send it to the client
			res.json(err);
		});
	});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

