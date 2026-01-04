import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    mediaUrl: {
      type: String,
      default: "", 
      // Example: S3 public URL → https://s3.amazonaws.com/bucket/file.jpg
    },

    mediaType: {
      type: String,
      enum: ["image", "video", "audio", "file", null],
      default: null,
    },

    isSeen: {
      type: Boolean,
      default: false,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deletedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent recompilation during hot reload
const Message = models.Message || mongoose.model("Message", MessageSchema);

export default Message;
