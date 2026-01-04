import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },

    username: {
      type: String,
      unique: true,
      sparse: true, // fixes potential uniqueness issues
    },

    status: {
      type: String, // example: "Happy", "Busy", etc.
      default: "",
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      select: false, // never expose during queries
      required: false, // not required for OAuth users
    },

    mobile: {
      type: String,
    },

    avatar: {
      type: String, // main profile picture
      default: "",
    },

    photos: {
      type: [String],
      default: [],
    },

    statusLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // users who liked the status
      },
    ],
  },
  { timestamps: true }
);

// Prevent re-compilation during hot reload
const User = models.User || mongoose.model("User", UserSchema);

export default User;
