module.exports = function (app) {
  const { authJwt } = require("../middlewares");
  const chatController = require("../controllers/chatController");
  app.route("/api/chat").get(authJwt.verifyToken, chatController.list_chats);
  app
    .route("/api/messages/:id")
    .get(authJwt.verifyToken, chatController.list_messages)
    .put(authJwt.verifyToken, chatController.update_unread);
  app
    .route("/api/unreadmessages")
    .get(authJwt.verifyToken, chatController.list_unread);
  app.route("/api/chat").post(authJwt.verifyToken, chatController.create_chat);
  app
    .route("/api/messages")
    .post(authJwt.verifyToken, chatController.create_message);
};
