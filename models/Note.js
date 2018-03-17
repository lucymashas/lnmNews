var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  articleid: { type: Schema.Types.ObjectId, ref: 'Headline' },
  note: String
});

var  Note = mongoose.model("Note", NoteSchema);

module.exports = Note;