// Click on notes button
$("#notesbtn").on("click", "button", function() {
  // Empty the notes from the note section
  $("#notes1").empty();
  // Save the id from the  tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // add the note information to the page
    .then(function(data) {
      var hbsObject ={notes:data}
      res.render('saved',hbsObject);
    });
      console.log(data);
});

//dismiss modal
$('#saveNote').submit(function(event) {
  event.preventDefault();
  // Coding
  $('#notesModal').modal('hide'); 
  return false;
});