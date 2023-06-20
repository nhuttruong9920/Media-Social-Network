const mongoose = require("mongoose");

const groupMessageSchema = mongoose.Schema(
  {
    groupConversation: {
      type: mongoose.Types.ObjectId,
      ref: "groupConversation",
    },
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    text: String,
    media: Array,
    call: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("groupMessage", groupMessageSchema);
