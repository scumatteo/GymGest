const { db, fields } = require("../models");
const mongoose = db.mongoose;
const User = db.user;

const fs = require("fs");

//get USER
exports.list_users = (req, res) => {
  User.find()
    .populate({
      path: "role",
      select: "name",
      match: {
        name: "user",
      },
    })
    .populate("gender")
    .select("name surname email gender image") //select permette di selezionare solo il campo che si vuole e col - davanti lo toglie
    .exec((err, users) => {
      users = users.filter((user) => {
        return user.role;
      });

      if (err) return res.status(500).send(err);
      return res.status(200).json(users);
    });
};

//get COACH
exports.list_coaches = (req, res) => {
  User.find()
    .populate({
      path: "role",
      select: "name",
      match: {
        name: "coach",
      },
    })
    .populate("gender")
    .select("name surname email phone bio image")
    .exec((err, coaches) => {
      if (err) return res.status(500).send(err);
      coaches = coaches.filter((user) => {
        return user.role;
      });

      return res.status(200).json(coaches);
    });
};

//get:id USER e COACH
exports.read_user = (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  User.findById(id, (err, user) => {
    if (err) return res.status(500).send(err);

    if (user == null)
      return res.status(404).send({
        description: "Utente non trovato",
      });

    return res.status(200).json(user);
  })
    .populate("role")
    .populate("gender")
    .select("-password");
};

//put:id USER e COACH
exports.update_user = (req, res) => {
  let user = {};
  if (req.file != null) {
    let img = {
      data: fs.readFileSync(req.file.path),
      contentType: req.file.mimetype,
    };

    req.body.image = img;
  } else {
    user.$unset = { image: 1 };
  }

  fields.user.forEach((field) => {
    if (req.body[field] != null) {
      user[field] = req.body[field];
    }
  });

  User.findOneAndUpdate(
    { _id: req.params.id },
    user,
    { new: true },
    (err, new_user) => {
      if (err) return res.status(500).send(err);

      if (new_user == null)
        return res.status(404).send({
          description: "Utente non trovato",
        });

      return res.status(200).json(new_user);
    }
  );
};

exports.update_coach = (req, res) => {
  let coach = {};
  if (req.file != null) {
    let img = {
      data: fs.readFileSync(req.file.path),
      contentType: req.file.mimetype,
    };

    req.body.image = img;
  } else {
    coach.$unset = { image: 1 };
  }

  fields.coach.forEach((field) => {
    if (req.body[field] != null) {
      coach[field] = req.body[field];
    }
  });

  User.findOneAndUpdate(
    { _id: req.params.id },
    coach,
    { new: true },
    (err, new_coach) => {
      if (err) return res.status(500).send(err);

      if (new_coach == null)
        return res.status(404).send({
          description: "Utente non trovato",
        });

      return res.status(200).json(new_coach);
    }
  );
};
