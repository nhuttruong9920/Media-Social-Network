const mongoose = require("mongoose");

const groupConversationSchema = new mongoose.Schema(
  {
    groupConversationName: String,
    recipients: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    groupAdmin: { type: mongoose.Types.ObjectId, ref: "user" },
    text: String,
    media: Array,
    call: Object,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("groupConversation", groupConversationSchema);
