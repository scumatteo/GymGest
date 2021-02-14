module.exports = function (app) {
  const { authJwt } = require("../middlewares");
  const mapsController = require("../controllers/mapsController");

  app
    .route("/api/maps")
    .post(authJwt.verifyToken, authJwt.isUser, mapsController.create_map)
    .get(authJwt.verifyToken, authJwt.isUser, mapsController.user_maps);

  app
    .route("/api/mapDetail/:id")
    .get(authJwt.verifyToken, mapsController.read_map);
};
