const express = require("express");
const router = express.Router();
const GuessController = require("../controllers/GuessController");
const GuestMiddleware = require("../middlewares/GuestMiddleware");

let guessRouter = server => {
  // List Don't Need Protect APIs:
  // Check Token User
  router.post("/addNewOrderByGuest", GuessController.addNewOrderByGuest);
  // Check Token MOD
  router.use(GuestMiddleware.isAuth);
  // check token
  router.post("/showOrderByToken", GuessController.showOrderByToken);

  return server.use("/guest", router);
};

module.exports = guessRouter;
