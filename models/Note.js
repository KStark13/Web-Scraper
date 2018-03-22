//Require mongoose
var mongoose = require("mongoose");

//Require Article
var Article = require("./Article");

//Create Schema class
var Schema = mongoose.Schema;

//Create Note schema
var NoteSchema = new Schema({

	body: {
		type: String
	},
	article: {
		type: Schema.Types.ObjectId,
		ref: "Article"
	}
});

//Create the Note Model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

//Export the Note model
module.exports = Note;