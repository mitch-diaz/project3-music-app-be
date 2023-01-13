const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {type: String},
    password: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    creatorTitle: {type: String},
    creatorProfile: {type: String},
    imageFile: {type: String},
    songs: { type: 
      [{type: Schema.Types.ObjectId, ref: 'Song'}]
    },
    videos: { type: 
      [{type: Schema.Types.ObjectId, ref: 'Video'}]
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;