// Click on notes button
$(document).on("click","#notesbtn",function(){ 
  console.log("I'm here");
  $("#notesContainer").empty();
    var thisId = $(this).attr("data-id");
    
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