module.exports = function (app) {
  const { authJwt } = require("../middlewares");
  const plansController = require("../controllers/plansController");

  app
    .route("/api/plans")
    .get(authJwt.verifyToken, plansController.list_plans)
    .post(authJwt.verifyToken, authJwt.isCoach, plansController.create_plan);

  app
    .route("/api/plans/:id")
    .get(authJwt.verifyToken, authJwt.isCoach, plansController.user_plans);

  app
    .route("/api/plan/:id")
    .put(authJwt.verifyToken, authJwt.isCoach, plansController.update_plan);

  app
    .route("/api/planDetail/:id")
    .get(authJwt.verifyToken, plansController.read_plan);
};
