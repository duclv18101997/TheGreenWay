const express = require("express");
const router = express.Router();
const ConversionController = require("../controllers/ConversionController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ModMiddleware = require("../middlewares/ModMiddleware");

let conversionRouter = server => {
  // List Don't Need Protect APIs:
  router.get(
    "/getInfoConversionbyID",
    ConversionController.getInfoConversionbyID
  );
  router.get(
    "/getConversionWorking",
    ConversionController.getConversionWorking
  );
  router.get("/getListConversion", ConversionController.getListConversion);
  // Check Token User
  router.use(AuthMiddleware.isAuth);
  // List Protect APIs:
  // Check Token MOD
  router.use(ModMiddleware.isAuth);
  // List Protect APIs:
  router.post("/addNewConversion", ConversionController.addNewConversion);
  router.put("/updateConversion", ConversionController.updateConversion);
  return server.use("/conversion", router);
};

module.exports = conversionRouter;
