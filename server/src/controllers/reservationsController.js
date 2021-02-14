const { db, fields } = require("../models");
const { Query } = require("mongoose");
const { populate } = require("../models/infoModel");
const mongoose = db.mongoose;
const Reservation = db.reservation;
const User = db.user;
const Notification = db.notification;
const NotificationStatus = db.notificationStatus;

exports.list_reservations = (req, res) => {
  User.findById(req.body.id)
    .populate("role")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);
      if (user.role.name == "coach") {
        Reservation.find()

          .populate({
            path: "notification",
            populate: {
              path: "status",
            },
          })
          .populate("user", "name surname email image")
          .populate({
            path: "coach",
            select: "_id",
            match: {
              _id: req.body.id,
            },
          })

          .exec((err, reservations) => {
            reservations = reservations.filter((reservation) => {
              return reservation.coach;
            });
            reservations = reservations.filter((reservation) => {
              return (
                reservation.notification.status.status === "pending" ||
                reservation.notification.status.status === "accepted"
              );
            });
            if (err) return res.status(500).send(err);
            return res.status(200).json(reservations);
          });
      } else if (user.role.name == "user") {
        Reservation.find()
          .populate({
            path: "notification",
            populate: {
              path: "status",
            },
          })
          .populate("coach", "name surname email phone image")
          .populate({
            path: "user",
            select: "_id",
            match: {
              _id: req.body.id,
            },
          })
          .exec((err, reservations) => {
            reservations = reservations.filter((reservation) => {
              return reservation.user;
            });
            reservations = reservations.filter((reservation) => {
              return (
                reservation.notification.status.status === "pending" ||
                reservation.notification.status.status === "accepted"
              );
            });

            if (err) return res.status(500).send(err);
            return res.status(200).json(reservations);
          });
      }
    });
};

exports.list_pendings = (req, res) => {
  Reservation.find({ $or: [{ coach: req.body.id }, { user: req.body.id }] })

    .populate({
      path: "notification",
      populate: {
        path: "status",
      },
    })
    .populate("user", "name surname email image")
    .populate("coach", "name surname email image")

    .exec((err, reservations) => {
      reservations = reservations.filter((reservation) => {
        return reservation.notification.status.status === "pending";
      });
      if (err) return res.status(500).send(err);
      return res.status(200).json(reservations);
    });
};

exports.list_responded = (req, res) => {
  Reservation.find({ $or: [{ coach: req.body.id }, { user: req.body.id }] })

    .populate({
      path: "notification",
      populate: {
        path: "status",
      },
    })
    .populate("user", "name surname email image")
    .populate("coach", "name surname email image")

    .exec((err, reservations) => {
      reservations = reservations.filter((reservation) => {
        return (
          !reservation.notification.seen &&
          (reservation.notification.status.status === "accepted" ||
            reservation.notification.status.status === "rejected")
        );
      });
      if (err) return res.status(500).send(err);
      return res.status(200).json(reservations);
    });
};

exports.coach_reservation = (req, res) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) return res.status(500).send(err);
    if (user == null) {
      res.status(404).send({ description: "Utente non trovato" });
    }

    Reservation.find()

      .populate({
        path: "notification",
        populate: {
          path: "status",
        },
      })
      .populate({
        path: "coach",
        select: "_id",
        match: {
          _id: req.params.id,
        },
      })

      .exec((err, reservations) => {
        reservations = reservations.filter((reservation) => {
          return reservation.coach;
        });
        if (err) return res.status(500).send(err);
        return res.status(200).json(reservations);
      });
  });
};

exports.create_reservation = (req, res) => {
  let new_reservation = new Reservation(req.body);

  User.findById(req.body.id, (err, user) => {
    if (err) return res.status(500).send(err);
    if (user == null) {
      return res.status(404).send({ description: "Utente non trovato" });
    }
    new_reservation.user = user;
    User.findById(req.body.idCoach, (err, coach) => {
      if (err) return res.status(500).send(err);
      if (coach == null) {
        return res.status(404).send({ description: "Coach non trovato" });
      }
      new_reservation.coach = coach;
      let new_notification = Notification({
        fromUser: user,
        toUser: coach,
        seen: false,
      });

      NotificationStatus.findOne({ status: "pending" }, (err, notStatus) => {
        if (err) return res.status(500).send(err);

        if (notStatus == null)
          return res.status(404).send({
            description: "Notifica non trovata",
          });
        new_notification.status = notStatus;
        new_notification.save((err, notification) => {
          if (err) return res.status(500).send(err);
          new_reservation.notification = notification;
          new_reservation.save((err, reservation) => {
            if (err) return res.status(500).send(err);
            return res.status(201).json(reservation);
          });
        });
      });
    }).select("_id name surname image");
  }).select("_id name surname image");
};

exports.accept_reservation = (req, res) => {
  NotificationStatus.findOne({ status: "accepted" }, (err, status) => {
    if (err) return res.status(500).send(err);
    Reservation.findOne({ _id: req.params.id })
      .populate({
        path: "notification",
        populate: {
          path: "status",
        },
      })
      .exec((err, reservation) => {
        if (err) return res.status(500).send(err);
        if (reservation == null)
          return res.status(404).send({ description: "Personal non trovato" });
        Notification.updateOne(
          { _id: reservation.notification._id },
          { status: status },
          { new: true },
          (err, new_reservation) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(new_reservation);
          }
        );
      });
  });
};

exports.reject_reservation = (req, res) => {
  NotificationStatus.findOne({ status: "rejected" }, (err, status) => {
    if (err) return res.status(500).send(err);
    Reservation.findOne({ _id: req.params.id })
      .populate({
        path: "notification",
        populate: {
          path: "status",
        },
      })
      .exec((err, reservation) => {
        if (err) return res.status(500).send(err);
        if (reservation == null)
          return res.status(404).send({ description: "Personal non trovato" });
        Notification.updateOne(
          { _id: reservation.notification._id },
          { status: status },
          { new: true },
          (err, new_reservation) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(new_reservation);
          }
        );
      });
  });
};

exports.seen_reservations = (req, res) => {
  let ids = JSON.parse(req.params.id)
  Reservation.find({ _id: { $in: ids } })
    .populate("notification")
    .exec((err, reservations) => {
      if (err) return res.status(500).send(err);
      if (reservations.length === 0)
        return res.status(404).send({ description: "Personal non trovato" });
      let ids = [];
      reservations.forEach((r) => {
        ids.push(r.notification._id);
      });

      Notification.updateMany(
        { _id: { $in: ids } },
        { seen: true },
        { new: true },
        (err, new_reservations) => {
          if (err) return res.status(500).send(err);
          return res.status(200).json(new_reservations);
        }
      );
    });
};
