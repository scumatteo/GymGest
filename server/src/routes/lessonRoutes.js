module.exports = function (app) {
  const { authJwt } = require("../middlewares");
  const lessonsController = require("../controllers/lessonsController");

  app
    .route("/api/lessons")
    .get(lessonsController.list_lessons)
    .post(
      authJwt.verifyToken,
      authJwt.isAdmin,
      lessonsController.create_lesson
    );

  app
    .route("/api/lesson/:id")
    .put(authJwt.verifyToken, authJwt.isAdmin, lessonsController.update_lesson)
    .delete(
      authJwt.verifyToken,
      authJwt.isAdmin,
      lessonsController.delete_lesson
    );

  app
    .route("/api/subscribeLesson/:id")
    .put(
      authJwt.verifyToken,
      authJwt.isUser,
      lessonsController.subscribe_lesson
    )
    .delete(
      authJwt.verifyToken,
      authJwt.isUser,
      lessonsController.delete_subscription
    );

  app
    .route("/api/lessonDetail/:id")
    .get(authJwt.verifyToken, lessonsController.read_lesson);
};
