// Click on notes button
$(document).on("click","#notesbtn",function(){ 
  $("#notesContainer").empty();
    var thisId = $("h3").attr("data-id");
    $.ajax({
      method: "GET",
      url: "/addnote/" + thisId
    });
  });

  $(document).on("click","#savearticle",function(){
    $("#alertmsg").css("display","block");
    $("#alertmsg").append("The Article Has Been Saved.");
    $("#").css("border","1px solid red")
});

//dismiss modal
$('#saveNote').submit(function(event) {
  event.preventDefault();
  // Coding
  $('#notesModal').modal('hide'); 
  return false;
});