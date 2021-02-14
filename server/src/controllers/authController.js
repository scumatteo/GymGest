const config = require("../config/authConfig");
const { db, fields } = require("../models");
const User = db.user;
const Role = db.role;
const Gender = db.gender;

var jwt = require("jsonwebtoken");

exports.signup_coach = (req, res) => {
  const coach = new User({
    name: req.body.name,
    surname: req.body.surname,
    CF: req.body.CF,
    email: req.body.email,
    password: req.body.password,
  });
  Gender.findOne({ name: req.body.gender }, (err, gender) => {
    if (err) return res.status(500).send(err);
    if (gender == null) {
      return res.status(400).send({ description: "Sesso non valido" });
    }
    coach.gender = gender;
    Role.findOne({ name: "coach" }, (err, role) => {
      if (err) return res.status(500).send(err);
      if (role == null) {
        return res.status(400).send({ description: "Ruolo non valido" });
      }
      coach.role = role;
      coach.save((err) => {
        if (err) return res.status(500).send(err);
        return res.status(201).json(coach);
      });
    });
  });
};

exports.signup_user = (req, res) => {
  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    CF: req.body.CF,
    email: req.body.email,
    password: req.body.password,
  });
  Gender.findOne({ name: req.body.gender }, (err, gender) => {
    if (err) return res.status(500).send(err);
    if (gender == null) {
      return res.status(400).send({ description: "Sesso non valido" });
    }
    user.gender = gender;

    Role.findOne({ name: "user" }, (err, role) => {
      if (err) return res.status(500).send(err);
      if (role == null) {
        return res.status(400).send({ description: "Ruolo non valido" });
      }
      user.role = role;
      user.save((err) => {
        if (err) return res.status(500).send(err);
        return res
          .status(201)
          .json({ message: "Utente registrato correttamente!" });
      });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("role", "name")
    .populate("gender")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);

      if (!user) return res.status(404).send({ description: "Utente non trovato" });

      var passwordIsValid = req.body.password == user.password;
      if (!passwordIsValid) {
        return res.status(401).send({
          description: "Passoword errata!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 ore
      });
      return res.status(200).json({
        id: user._id,
        email: user.email,
        role: user.role.name, 
        CF: user.CF == null ? undefined : user.CF,
        name: user.name == null ? undefined : user.name,
        surname: user.surname == null ? undefined : user.surname ,
        gender: user.gender.name == null ? undefined : user.gender.name,

        address: user.address == null ? undefined : user.address,
        phone: user.phone == null ? undefined : user.phone,
        birthday: user.birthday == null ? undefined : user.birthday,
        bio: user.bio == null ? undefined : user.bio,
        workingDays: user.workingDays == null ? undefined : user.workingDays,
        image: user.image == null ? undefined : user.image,
        accessToken: token,
      });
    });
};
