const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const { db } = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token)
    return res.status(403).send({ description: "Nessun token fornito!" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(401).send({ description: "Non autorizzato!" });

    req.body.id = decoded.id;
    return next();
  });
};

isAdminOrCoach = (req, res, next) => {
  User.findById(req.body.id)
    .populate("role", "name")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);
      Role.findById(user.role._id, (err, role) => {
        if (err) return res.status(500).send(err);

        if (role.name != "admin" && role.name != "coach")
          return res
            .status(401)
            .send({ description: "Devi essere coach o admin!" });
        return next();
      });
    });
};

isAdmin = (req, res, next) => {
  User.findById(req.body.id)
    .populate("role", "name")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);

      Role.findById(user.role._id, (err, role) => {
        if (err) return res.status(500).send(err);

        if (role.name != "admin")
          return res.status(401).send({ description: "Devi essere admin!" });
        return next();
      });
    });
};

isCoach = (req, res, next) => {
  User.findById(req.body.id)
    .populate("role", "name")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);

      Role.findById(user.role._id, (err, role) => {
        if (err) return res.status(500).send(err);

        if (role.name != "coach")
          return res.status(401).send({ description: "Devi essere coach!" });
        return next();
      });
    });
};

isUserOrCoach = (req, res, next) => {
  User.findById(req.body.id)
    .populate("role", "name")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);

      Role.findById(user.role._id, (err, role) => {
        if (err) return res.status(500).send(err);

        if (role.name != "coach" && role.name != "user")
          return res.status(401).send({ description: "Devi essere utente o coach!" });
        return next();
      });
    });
};

isUser = (req, res, next) => {
  User.findById(req.body.id)
    .populate("role", "name")
    .exec((err, user) => {
      if (err) return res.status(500).send(err);

      Role.findById(user.role._id, (err, role) => {
        if (err) return res.status(500).send(err);

        if (role.name != "user")
          return res.status(401).send({ description: "Devi essere un utente!" });
        return next();
      });
    });
};

const authJwt = {
  verifyToken,
  isAdminOrCoach,
  isAdmin,
  isCoach,
  isUser,
};
module.exports = authJwt;
