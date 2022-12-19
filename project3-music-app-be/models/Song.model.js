const { Schema, model } = require("mongoose");

const songSchema = new Schema(
  {
    songFile: {type: String},
    songTitle: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
  }
);

const Song = model("Song", songSchema);
module.exports = Song;