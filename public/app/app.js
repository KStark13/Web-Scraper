//grab articles as a jason
$.getJSON("/articles", function(data) {
	//for each one
	for(var i = 0; i < data.length; i++) {
		//display information on the page
		 $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

//when someone click a p tag
$(document).on("click", "p", function() {
	//empty the notes from the note section
	$("#notes").empty();
	var thisId = $(this).attr("data-id");


//making an ajax call for the Article
$.ajax({
	method:"GET",
	url: "/articles/" + thisId
})

// add note information to the page
.then(function(data) {
	console.log(data);
	//title of the article
	$("#notes").append("<h2>" + data.title + "</h2");
	//an input to enter the new title
	$("#notes").append("<input id='titleinput' name= 'title' >");
	//text area to add a new note body
	$("#notes").append("<textarea id='bodyinput' name='body'></textarea");
	//button to submit a new note, with the id of the article saved to it
	$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
	

	//if theres a note in the article
	if (data.note) {
		//place the title of the note in the title input
		$("#titleinput").val(data.note.title);
		//place the body of the note in the body text area
		$("#bodyinput").val(data.note.body);
	}
	});
});

//when you click on the savenote button
$(document).on("click", "#savenote", function(){
 //grab the id associate with the article form the submit button
 var thisId = $(this).attr("data-id");

 //run a POST request to change the note, using whats entered in the inputs

 $.ajax({
 	method: "POST",
 	url: "/articles/" + thisId,
 	data: {
 		//value take from title input
 		title: $("#titleinput").val(),
 		//value taken from note textarea
 		body: $("#bodyinput").val()
 	}
 })
 	.then(function(data){
 		console.log(data);
 		//empty the notes section
 		$("#notes").empty();
 	});
 	//remove the values entered in the input and textarea for note entry
 	$("#titleinput").val("");
 	$("#bodyinput").val("");
});