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
      sparse: true,
    },

    status: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      select: false,
      required: false,
    },

    mobile: {
      type: String,
    },

    avatar: {
      type: String,
      default: "",
    },

    photos: {
      type: [String],
      default: [],
    },

    statusLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);

export default User;
