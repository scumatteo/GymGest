module.exports = function (app) {
  const { authJwt } = require("../middlewares");
  const usersController = require("../controllers/usersController");

  app
    .route("/api/users")
    .get(
      authJwt.verifyToken,
      authJwt.isAdminOrCoach,
      usersController.list_users
    );

  app
    .route("/api/users/:id")
    .get(authJwt.verifyToken, authJwt.isAdminOrCoach, usersController.read_user)
    .put(authJwt.verifyToken, authJwt.isUser, usersController.update_user);

  app
    .route("/api/coaches")
    .get(usersController.list_coaches);

  app
    .route("/api/coaches/:id") //si può togliere?
    .get(authJwt.verifyToken, usersController.read_user)
    .put(authJwt.verifyToken, authJwt.isAdminOrCoach, usersController.update_coach);
};
