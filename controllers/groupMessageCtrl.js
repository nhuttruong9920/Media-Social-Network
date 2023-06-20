const GroupConversation = require("../models/groupConversationModel");
const GroupMessage = require("../models/groupMessageModel");
const User = require("../models/userModel");

const createGroupConversation = async (req, res) => {
  const { groupConversationName, recipientsString } = req.body;
  if (groupConversationName === "" || recipientsString === "") {
    return res.json({ msg: "Please fill all the fields" });
  }
  const recipientsArray = JSON.parse(recipientsString);
  if (recipientsArray.length < 2) {
    return res.json({
      msg: "More than 2 users are required to form a group chat",
    });
  }

  recipientsArray.push(req.user);
  try {
    const groupMessage = await GroupConversation.create({
      groupConversationName,
      recipients: recipientsArray,
      groupAdmin: req.user,
    });

    // const fullGroupMessage = await GroupConversation.findOne({
    //   _id: groupMessage._id,
    // })
    //   .populate("recipients", "-password")
    //   .populate("groupAdmin", "-password");
    res.status(200).json({ msg: "Create a new group success!" });
    // res.status(200).json(fullGroupMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const deleteGroupConversation = async (req, res) => {
  const userId = req.user._id;
  const conversationId = req.params.id;

  try {
    const conversation = await GroupConversation.findById(conversationId);

    if (!conversation) {
      return res.status(200).json({ msg: "Conversation not found!" });
    }

    if (JSON.stringify(userId) !== JSON.stringify(conversation.groupAdmin)) {
      return res
        .status(200)
        .json({ msg: "You are not an admin of this group!" });
    }

    await conversation.delete(conversationId);

    res.status(200).json({
      msg: "Delete success!",
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
const renameGroupConversation = async (req, res) => {
  const newGroupName = req.body.newGroupName;
  const conversationId = req.params.id;
  const userId = req.user._id;

  try {
    const conversation = await GroupConversation.findById(conversationId);

    if (!conversation) {
      return res.status(200).json({ msg: "Conversation not found!" });
    }

    if (JSON.stringify(userId) !== JSON.stringify(conversation.groupAdmin)) {
      return res
        .status(200)
        .json({ msg: "You are not an admin of this group!" });
    }

    const newConversation = await GroupConversation.findOneAndUpdate(
      { _id: conversationId },
      { groupConversationName: newGroupName }
    );

    res.status(200).json({ msg: "Rename success!", newConversation });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getGroupConversationById = async (req, res) => {
  try {
    const group = await GroupConversation.find({
      _id: req.params.id,
    })
      .populate("groupAdmin", "avatar")
      .populate("recipients", "avatar fullname username");

    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const getGroupConversation = async (req, res) => {
  try {
    GroupConversation.find({
      recipients: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("groupAdmin", "avatar")
      // .populate("recipients", "-password")
      // .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, "");
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const removeFromGroup = async (req, res) => {
  const conversationId = req.params.id;
  const { removeId } = req.body;
  const userId = req.user._id;

  try {
    const conversation = await GroupConversation.findById(conversationId);

    if (JSON.stringify(userId) !== JSON.stringify(conversation.groupAdmin)) {
      return res
        .status(200)
        .json({ msg: "You are not an admin of this group!" });
    }
    const removed = await GroupConversation.findByIdAndUpdate(
      conversationId,
      {
        $pull: { recipients: removeId },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ msg: "Remove user form chat success!" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const createGroupMessage = async (req, res) => {
  const { groupConversationId, text, media, call } = req.body;
  let newGroupMessage = {
    sender: req.user._id,
    groupConversation: groupConversationId,
    text,
    media,
    call,
  };

  try {
    const conversation = await GroupConversation.findById(groupConversationId);

    if (!conversation) {
      return res.json({ msg: "Conversation not found!" });
    }

    let message = await GroupMessage.create(newGroupMessage);

    const createdMessage = await GroupMessage.findOne({
      _id: message._id,
    })
      .populate("groupConversation", "groupConversationName")
      .populate("sender", "avatar fullname");

    res.json(createdMessage);
  } catch (error) {
    res.status(400).json({
      msg: "Create group message failed",
      error,
    });
  }
};

const getGroupMessage = async (req, res) => {
  try {
    const messages = await GroupMessage.find({
      groupConversation: req.params.groupConversationId,
    })
      .populate("sender", "avatar fullname")
      .populate("groupConversation", "groupConversationName");

    res.json(messages);
  } catch (error) {
    res.status(400).json({ msg: "Failed", error });
  }
};

module.exports = {
  createGroupConversation,
  deleteGroupConversation,
  renameGroupConversation,
  getGroupConversationById,
  getGroupConversation,
  removeFromGroup,
  getGroupMessage,
  createGroupMessage,
};
