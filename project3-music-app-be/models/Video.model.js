const { Schema, model } = require("mongoose");

const videoSchema = new Schema(
  {
    videoUrl: {type: String},
    videoTitle: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
  },
  {
    timestamps: true,
  }
);

const Video = model("Video", videoSchema);
module.exports = Video;