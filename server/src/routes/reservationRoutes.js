module.exports = function (app) {
  const { authJwt } = require("../middlewares");
  const reservationController = require("../controllers/reservationsController");

  app
    .route("/api/reservations")
    .get(authJwt.verifyToken, reservationController.list_reservations)
    .post(
      authJwt.verifyToken,
      authJwt.isUser,
      reservationController.create_reservation
    );

  app
    .route("/api/pendingReservations")
    .get(authJwt.verifyToken, reservationController.list_pendings);
  app
    .route("/api/respondedReservations")
    .get(authJwt.verifyToken, reservationController.list_responded);

  app
    .route("/api/acceptReservation/:id")
    .put(
      authJwt.verifyToken,
      authJwt.isCoach,
      reservationController.accept_reservation
    );
  app
    .route("/api/rejectReservation/:id")
    .put(
      authJwt.verifyToken,
      authJwt.isCoach,
      reservationController.reject_reservation
    );
  app
    .route("/api/seenReservations/:id")
    .put(
      authJwt.verifyToken,
      authJwt.isUser,
      reservationController.seen_reservations
    );

  app
    .route("/api/reservations/:id")
    .get(
      authJwt.verifyToken,
      authJwt.isUser,
      reservationController.list_reservations
    );
};
