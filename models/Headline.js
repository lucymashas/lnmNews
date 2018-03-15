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
    default: "assets/images/image-placeholder.png"
  },
  issaved:{
    type:Boolean,
    default: false
  },
  note:{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var  Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;