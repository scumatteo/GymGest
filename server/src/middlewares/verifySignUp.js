const { db } = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) return res.status(500).send(err);

      if (user)
        return res
          .status(409)
          .send({ description: "Email già in uso!" });
      return next();
    }
  );
};

checkRoleExists = (req, res, next) => {
  if (req.body.role) {
    if (!ROLES.includes(req.body.role)) {
      return res.status(404).send({
        description: `Ruolo ${req.body.role} non esistente!`,
      });
    }
  }

  return next();
};

const verifySignUp = {
  checkDuplicateEmail,
  checkRoleExists,
};

module.exports = verifySignUp;
