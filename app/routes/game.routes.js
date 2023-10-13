
import express from 'express';
import {roundWinner} from '../controllers/game.controller.js';
import {roundChallenge} from '../controllers/game.controller.js';
import {init} from '../controllers/game.controller.js';
import {status} from '../controllers/game.controller.js';
import {gameSummary} from '../controllers/game.controller.js';
import {join} from '../controllers/game.controller.js';
import {placeBid} from '../controllers/game.controller.js';
import {diceRoll} from '../controllers/game.controller.js';
import {forfeit} from '../controllers/game.controller.js';


const router = express.Router()

router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

router.get("/api/game/roundWinner", roundWinner);
router.post("/api/game/roundChallenge", roundChallenge);
router.post("/api/game/init", init);
router.post("/api/game/placeBid", placeBid);
router.post("/api/game/diceRoll", diceRoll);
router.post("/api/game/forfeit", forfeit);
router.get("/api/game/status", status);
router.get("/api/game/summary", gameSummary);
router.get("/api/game/join", join);


export default router;