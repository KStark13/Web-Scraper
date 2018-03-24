//Handle Scrape Button
$("#scrape").on("click", function(){
	$.ajax({
		method:"GET",
		url:"/scrape",
	}).done(function(data){
		console.log(data)
		window.location = "/"
	})
});

//Handle Save Article Button
$(".save").on("click", function (){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/save" + thisId
	}).done(function(data) {
		window.location = "/"
	})
});
//Handle the Delete Article Button
$(".delete").on("click", function (){
	var thisId = $(this).attr("data-id");
	$.ajax({
		method: "POST",
		url: "/articles/delte" + thisId
	}).done(function(data){
		window.location = "/saved"
	})
});
//Handle Save Note Button
$(".saveNote").on("click", function(){
	var thisId = $(this).attr("data-id");
	if (!$("#noteText" + thisId).val()) {
		alert("Please enter a note to save")
	} else {
		$.ajax({
			method: "POST",
			url: "/notes/save" + thisId,
			data: {
				text: $("#noteText" + thisId).val()
			}
		}).done(function(data){
			console.log(data);
			//Empty the note section
			$("#noteText" + thisId).val("");
			$(".modalNote").modal("hide")
			window.location = "/saved"
		});
	}
});
//Handle Delete Note Button
$("#deleteNote").on("click", function(){
	var noteId = $(this).attr("data-note-id");
	var articleId = $(this).attr("data-article-id");
	$.ajax({
		method: "DELETE",
		url: "/notes/delete/" + noteId + "/" + articleId
	}).done(function(data){
		console.log(data)
		$(".modalNote").modal("hide");
		window.location = "/saved"
	})
});