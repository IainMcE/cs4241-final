
import express from 'express';
import {roundWinner} from '../controllers/game.controller.js';
import {roundChallenge} from '../controllers/game.controller.js';
import {init} from '../controllers/game.controller.js';
import {status} from '../controllers/game.controller.js';
import {gameSummary} from '../controllers/game.controller.js';


const router = express.Router()

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

router.post("/api/game/roundWinner", roundWinner);
router.post("/api/game/roundChallenge", roundChallenge);
router.post("/api/game/init", init);
router.get("/api/game/status", status);
router.get("/api/game/summary", gameSummary);

export default router;