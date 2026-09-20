const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDatatable",
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDatatable",
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", MessageSchema);
