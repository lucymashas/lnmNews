var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
  headline: {
    type: String,
    trim: true,
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
  note:{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var  Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;