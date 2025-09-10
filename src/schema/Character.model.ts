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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Character", characterSchema);
