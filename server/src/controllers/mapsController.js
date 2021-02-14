const { db } = require("../models");
const mongoose = db.mongoose;
const User = db.user;
const Map = db.map;
const { authJwt } = require("../middlewares");



exports.user_maps = (req, res) => {
  User.findById(req.body.id).exec((err, user) => {
    if (err) return res.status(500).send(err);
    if (user == null) {
      return res.status(404).send({ description: "Utente non trovato" });
    }

    Map.find()
      .populate({
        path: "user",
        select: "_id",
        match: {
          _id: req.body.id,
        },
      })
      .select("date time distance")
      .exec((err, maps) => {
        maps = maps.filter((map) => {
          return map.user;
        });
        if (err) return res.status(500).send(err);
        return res.status(200).json(maps);
      });
  });
};

exports.read_map = (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  Map.findById(id, (err, map) => {
    if (err) return res.status(500).send(err);

    if (map == null)
      return res.status(404).send({
        description: "Mappa non trovata",
      });

    return res.status(200).json(map);
  })
};

exports.create_map = (req, res) => {
  let new_map = new Map(req.body);
  User.findById(req.body.id, (err, user) => {
    if (err) return res.status(500).send(err);
    if (user == null) {
      return res.status(404).send({ description: "Utente non trovato" });
    }
    new_map.user = user;
    new_map.save((err, map) => {
      if (err) return res.status(500).send(err);
      return res.status(201).json(map);
    });
  });
};
