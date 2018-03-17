// Click on notes button
$(document).on("click","#notesbtn",function(){ 
  $("#notesContainer").empty();
    var thisId = $("h3").attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    .then (function(data){
      console.log(data);
    }
});

//dismiss modal
$('#saveNote').submit(function(event) {
  event.preventDefault();
  // Coding
  $('#notesModal').modal('hide'); 
  return false;
});