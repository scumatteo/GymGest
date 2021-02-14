const { db } = require("../models");
const mongoose = db.mongoose;
const User = db.user;
const Plan = db.plan;
const { authJwt } = require("../middlewares");

exports.list_plans = (req, res) => {
  User.findById(req.body.id)
    .populate("role")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);
      if (user.role.name == "coach") {
        Plan.find()
          .populate({
            path: "coach",
            select: "_id",
            match: {
              _id: req.body.id,
            },
          })
          .populate("coach", "email name surname")
          .select("user initialDate finalDate goal")
          .exec((err, plans) => {
            plans = plans.filter((plan) => {
              return plan.coach._id == req.body.id;
            });
            if (err) return res.status(500).send(err);
            return res.status(200).json(plans);
          });
      } else if (user.role.name == "user") {
        Plan.find()
          .populate({
            path: "user",
            select: "_id",
            match: {
              _id: req.body.id,
            },
          })
          .populate("user", "email name surname")
          .select("coach initialDate finalDate goal")
          .exec((err, plans) => {
            plans = plans.filter((plan) => {
              return plan.user._id == req.body.id;
            });
            if (err) return res.status(500).send(err);
            return res.status(200).json(plans);
          });
      }
    });
};

exports.user_plans = (req, res) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) return res.status(500).send(err);
    if (user == null) {
      return res.status(404).send({ description: "Utente non trovato" });
    }

    Plan.find()
      .populate({
        path: "user",
        select: "_id",
        match: {
          _id: req.params.id,
        },
      })
      .populate("coach", "email name surname")
      .select("coach initialDate finalDate goal")
      .exec((err, plans) => {
        plans = plans.filter((plan) => {
          return plan.user;
        });
        if (err) return res.status(500).send(err);
        return res.status(200).json(plans);
      });
  });
};

exports.read_plan = (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  Plan.findById(id, (err, plan) => {
    if (err) return res.status(500).send(err);

    if (plan == null)
      return res.status(404).send({
        description: "Scheda non trovata",
      });

    return res.status(200).json(plan);
  })
    .populate("coach", "email name surname")
    .populate("user", "email name surname");
};

exports.update_plan = (req, res) => {
  Plan.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, plan) => {
      if (err) return res.status(500).send(err);
      if (plan == null)
        return res.status(404).send({
          description: "Scheda non trovata",
        });

      return res.status(200).json(plan);
    }
  )
    .populate("coach", "email")
    .populate("user", "email");
};

exports.create_plan = (req, res) => {
  let new_plan = new Plan(req.body);
  User.findById(req.body.id, (err, coach) => {
    if (err) return res.status(500).send(err);
    if (coach == null) {
      return res.status(404).send({ description: "Coach non trovato" });
    }
    new_plan.coach = coach;
    User.findById(req.body.idUser, (err, user) => {
      if (err) return res.status(500).send(err);
      if (user == null) {
        return res.status(404).send({ description: "Utente non trovato" });
      }
      new_plan.user = user;
      new_plan.save((err, plan) => {
        if (err) return res.status(500).send(err);
        return res.status(201).json(plan);
      });
    });
  });
};
