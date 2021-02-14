const { db } = require("../models");
const Info = db.info;

exports.info = (req, res) => {
  Info.find({}, (err, info) => {
    if (err) return res.status(500).send(err);
    return res.json(info);
  });
};

exports.update_info = (req, res) => {
  Info.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, new_info) => {
      if (err) return res.status(500).send(err);

      if (new_info == null)
        return res.status(404).send({
          description: "Info non trovate!",
        });

      return res.json(new_info);
    }
  );
};
