const router = require("express").Router();
const groupMessageCtrl = require("../controllers/groupMessageCtrl");
const auth = require("../middleware/auth");

router.post("/group", auth, groupMessageCtrl.createGroupConversation);
router.delete("/group/:id", auth, groupMessageCtrl.deleteGroupConversation);
router.put("/group/:id", auth, groupMessageCtrl.renameGroupConversation);
router.get("/group", auth, groupMessageCtrl.getGroupConversation);
router.get("/group/:id", auth, groupMessageCtrl.getGroupConversationById);
router.put("/group/remove/:id", auth, groupMessageCtrl.removeFromGroup);

router.get(
  "/groupmessage/:groupConversationId",
  auth,
  groupMessageCtrl.getGroupMessage
);

router.post("/groupmessage", auth, groupMessageCtrl.createGroupMessage);

module.exports = router;
