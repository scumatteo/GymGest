module.exports = function (app) {
  const { authJwt } = require("../middlewares");
  const infoController = require("../controllers/infoController");
  app.route("/api/info").get(infoController.info);
  app
    .route("/api/info/:id")
    .put(authJwt.verifyToken, authJwt.isAdmin, infoController.update_info);
};
