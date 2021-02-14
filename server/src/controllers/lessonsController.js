const { db } = require("../models");
const lessonRoutes = require("../routes/lessonRoutes");
const mongoose = db.mongoose;
const User = db.user;
const Lesson = db.lesson;

exports.list_lessons = (req, res) => {
  Lesson.find()
    .populate("coach", "-password")

    .exec((err, lesson) => {
      if (err) return res.status(500).send(err);
      res.json(lesson);
    });
};

exports.read_lesson = (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  Lesson.findById(id, (err, lesson) => {
    if (err) return res.status(500).send(err);

    if (lesson == null)
      return res.status(404).send({
        description: "Corso non trovato",
      });

    return res.status(200).json(lesson);
  })
    .populate("coach", "-password")
    .populate("users", "-password");
};

exports.update_lesson = (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  User.findById(req.body.coach._id, (err, coach) => {
    if (err) return res.status(500).send(err);
    if (coach == null)
      return res.status(404).send({ description: "Coach non trovato" });
    req.body.coach = coach;
    Lesson.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (err, lesson) => {
        if (err) return res.status(500).send(err);

        if (lesson == null)
          return res.status(404).send({
            description: "Corso non trovato",
          });

        return res.status(200).json(lesson);
      }
    )
      .populate("users", "-password")
      .populate("coach", "-password -image");
  }).select("-password -image");
};

exports.create_lesson = (req, res) => {
  User.findById(req.body.coach, (err, coach) => {
    if (err) return res.status(500).send(err);
    if (coach == null)
      return res.status(404).send({ description: "Coach non trovato" });
    req.body.coach = coach;
    let new_lesson = new Lesson(req.body);
    new_lesson.save((err, lesson) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(lesson);
    });
  }).select("-password -image");
};

exports.delete_lesson = (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  Lesson.deleteOne({ _id: req.params.id }).exec((err, result) => {
    if (err) return res.status(500).send(err);

    if (result.deletedCount == 0)
      return res.status(404).send({
        description: "Corso non trovato",
      });
    return res.status(200).json({ message: "Corso cancellato correttamente" });
  });
};

exports.subscribe_lesson = (req, res) => {
  User.findById(req.body.id, (err, user) => {
    if (err) return res.status(500).send(err);
    if (user == null)
      return res.status(404).send({ description: "Utente non trovato" });
    Lesson.findById(req.params.id)
      .populate("users", "-password")
      .exec((err, result) => {
        if (err) return res.status(500).send(err);
        let users = result.users;
        users = users.filter((u) => {
          return u._id != user._id;
        });

        if (users.length > 0) {
          return res
            .status(401)
            .send({ message: "Sei già iscritto a questo corso!" });
        }
        Lesson.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { users: user } },
          { new: true },
          (err, lesson) => {
            if (err) return res.status(500).send(err);

            if (lesson == null)
              return res.status(404).send({
                description: "Corso non trovato",
              });

            return res.status(200).json(lesson);
          }
        )
          .populate("coach", "-password")
          .populate("users", "-password");
      });
  });
};

exports.delete_subscription = (req, res) => {
  User.findById(req.body.id, (err, user) => {
    if (err) return res.status(500).send(err);
    if (user == null)
      return res.status(404).send({ description: "Utente non trovato" });

    Lesson.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { users: user._id } },
      { new: true },
      (err, lesson) => {
        if (err) return res.status(500).send(err);

        if (lesson == null)
          return res.status(404).send({
            description: "Corso non trovato",
          });

        return res.status(200).json(lesson);
      }
    )
      .populate("coach", "-password")
      .populate("users", "-password");
  });
};
