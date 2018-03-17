var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
  
  headline: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  link:{
    type: String,
    required: true
  },
  summary:{
    type:String,
    required: true
  },
  img:{
    type: String,
  },
  issaved:{
    type:Boolean,
    default: false
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note:{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var  Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;