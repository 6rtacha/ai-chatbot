import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    userPassword: {
      type: String,
      required: true,
      select: false,
    },

    userImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
