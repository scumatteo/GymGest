module.exports = function (app) {
  require("./userRoutes")(app);
  require("./authRoutes")(app);
  require("./infoRoutes")(app);
  require("./planRoutes")(app);
  require("./mapRoutes")(app);
  require("./lessonRoutes")(app);
  require("./reservationRoutes")(app);
  require("./chatRoutes")(app);
};
