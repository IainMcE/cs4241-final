
const controller = require("../controllers/game.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/game/roundWinner", controller.roundWinner);
  app.post("/api/game/roundChallenge", controller.roundChallenge);
  app.post("/api/game/init", controller.init);
  app.get("/api/game/status", controller.status);
  app.get("/api/game/summary", controller.summary);
};