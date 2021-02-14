const { db } = require("../models");
const Chat = db.chat;
const User = db.user;
const Message = db.message;
const MessageStatus = db.messageStatus;

exports.list_chats = (req, res) => {
  Chat.find({ $or: [{ user1: req.body.id }, { user2: req.body.id }] })
    .populate("user1", "name surname email phone image")
    .populate("user2", "name surname email phone image")
    .exec((err, chat) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(chat);
    });
};

exports.list_messages = (req, res) => {
  Message.find({
    $or: [
      { fromUser: req.body.id, toUser: req.params.id },
      { fromUser: req.params.id, toUser: req.body.id },
    ],
  })
    .populate("status")
    .populate("fromUser", "image")
    .populate("toUser", "image")
    .exec((err, msg) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(msg);
    });
};

exports.list_unread = (req, res) => {
  MessageStatus.findOne({ status: "sent" }, (err, status) => {
    if (err) return res.status(500).send(err);
    Message.find(
      {
        status: status._id,
        toUser: req.body.id,
      },
      (err, messages) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(messages);
      }
    );
  });
};

exports.update_unread = (req, res) => {
  MessageStatus.findOne({ status: "seen" }, (err, seen) => {
    if (err) return res.status(500).send(err);
    MessageStatus.findOne({ status: "sent" }, (err, sent) => {
      if (err) return res.status(500).send(err);
      Message.updateMany(
        { status: sent, toUser: req.body.id, fromUser: req.params.id },
        { status: seen },
        { new: true },
        (err, message) => {
          if (err) return res.status(500).send(err);
          return res.status(200).json(message.nModified);
        }
      );
    });
  });
};

exports.create_chat = (req, res) => {
  let new_chat = new Chat();
  User.findById(req.body.id, (err, fromUser) => {
    if (err) return res.status(500).send(err);
    if (fromUser == null)
      return res.status(404).send({ description: "Utente non trovato" });
    new_chat.fromUser = user;
    User.findById(req.body.toId, (err, toUser) => {
      if (err) return res.status(500).send(err);
      if (toUser == null)
        return res.status(404).send({ description: "Utente non trovato" });
      new_chat.toUser = toUser;
      new_chat.save((err, chat) => {
        if (err) return res.status(500).send(err);
        return res.status(201).json(chat);
      });
    }).select("name surname email phone image");
  }).select("name surname email phone image");
};

exports.create_message = (req, res) => {
  Chat.findOne(
    {
      $or: [
        { user1: req.body.id, user2: req.body.toId },
        { user1: req.body.toId, user2: req.body.id },
      ],
    },
    (err, chat) => {
      if (err) return res.status(500).send(err);
      if (chat == null) {
        let new_chat = Chat({
          user1: req.body.id,
          user2: req.body.toId,
        });
        new_chat.save();
      }
    }
  );
  let new_message = new Message({
    fromUser: req.body.id,
    toUser: req.body.toId,
    content: req.body.content,
    timestamp: req.body.timestamp,
  });
  MessageStatus.findOne({ status: "sent" }, (err, status) => {
    if (err) return res.status(500).send(err);
    new_message.status = status;
    new_message.save((err, msg) => {
      if (err) return res.status(500).send(err);
      Message.findById(msg._id)
        .populate("fromUser", "name surname")
        .populate("toUser", "name surname")
        .exec((err, message) => {
          if (err) return res.status(500).send(err);
          return res.status(201).json(message);
        });
    });
  });
};
