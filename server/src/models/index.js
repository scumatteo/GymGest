const mongoose = require("mongoose");

const db = {};

db.mongoose = mongoose;

db.user = require("./usersModel");
db.role = require("./rolesModel");
db.info = require("./infoModel");
db.plan = require("./plansModel");
db.map = require("./mapsModel");
db.messageStatus = require("./messageStatusModel");
db.chat = require("./chatModel");
db.message = require("./messageModel");
db.lesson = require("./lessonModel");
db.notification = require("./notificationModel");
db.notificationStatus = require("./notificationStatusModel");
db.reservation = require("./reservationModel");
db.gender = require("./genderModel");

const Role = db.role;
const MessageStatus = db.messageStatus;
const NotificationStatus = db.notificationStatus;
const Gender = db.gender;

db.ROLES = ["user", "coach", "admin"];
db.MESSAGESTATUS = ["sent", "seen"];
db.NOTIFICATIONSTATUS = ["pending", "accepted", "rejected"];
db.GENDERS = { male: "M", female: "F" };

const fields = {};
fields.user = [
  "name",
  "surname",
  "address",
  "password",
  "gender",
  "phone",
  "birthday",
  "image",
];

fields.coach = [
  "name",
  "surname",
  "address",
  "password",
  "gender",
  "phone",
  "birthday",
  "image",
  "bio",
  "workingDays",
];

initializeMongoose = () => {
  initializeRoles();
  initializeMessageStatus();
  initializeNotificationStatus();
  initializeGenders();
};

initializeRoles = () => {
  db.role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      db.ROLES.map((role) =>
        new Role({ name: role }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log(`added '${role}' to roles collection`);
        })
      );
    }
  });
};

initializeMessageStatus = () => {
  db.messageStatus.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      db.MESSAGESTATUS.map((message) =>
        new MessageStatus({
          status: message,
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log(`added '${message}' to message status collection`);
        })
      );
    }
  });
};

initializeNotificationStatus = () => {
  db.notificationStatus.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      db.NOTIFICATIONSTATUS.map((notification) =>
        new NotificationStatus({
          status: notification,
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
          console.log(
            `added '${notification}' to notification status collection`
          );
        })
      );
    }
  });
};

initializeGenders = () => {
  db.gender.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      Object.keys(db.GENDERS).forEach((key) => {
        new Gender({
          name: key,
          gender: db.GENDERS[key],
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
          console.log(`added '${key}' to genders collection`);
        });
      });
    }
  });
};

module.exports = { db, fields, initializeMongoose };
