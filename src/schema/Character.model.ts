import mongoose, { Schema } from "mongoose";

const characterSchema = new Schema(
  {
    characterName: {
      type: String,
      required: true,
    },

    characterPrompt: {
      type: String,
      required: true,
    },

    characterImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Character", characterSchema);
