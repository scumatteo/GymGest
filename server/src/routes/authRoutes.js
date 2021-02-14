module.exports = function (app) {
  const { verifySignUp, authJwt } = require("../middlewares");
  const authController = require("../controllers/authController");

  app
    .route("/api/auth/signupCoach")
    .post(
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRoleExists,
      authJwt.verifyToken,
      authJwt.isAdmin,
      authController.signup_coach
    );

  app
    .route("/api/auth/signup")
    .post(
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRoleExists,
      authController.signup_user
    );

  app.route("/api/auth/signin").post(authController.signin);
};
