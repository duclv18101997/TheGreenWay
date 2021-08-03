const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ModMiddleware = require("../middlewares/ModMiddleware");

let orderRouter = (server) => {
  // List Don't Need Protect APIs:
  router.get("/getInforAbout", OrderController.getInforAbout);
  // Check Token User
  router.use(AuthMiddleware.isAuth);
  // List Protect APIs:
  router.post("/addNewOrderByUser", OrderController.addNewOrderByUser);
  router.get("/showOrderListByEmail", OrderController.showOrderListByEmail);
  router.get("/showOrderByEmail", OrderController.showOrderByEmail);
  // Check Token MOD
  router.use(ModMiddleware.isAuth);
  // List Protect APIs:
  router.get("/showOrderByID", OrderController.showOrderByID);
  router.get("/showOrderListForMOD", OrderController.showOrderListForMOD);
  router.put("/changeStatusOrder", OrderController.changeStatusOrder);
  router.get(
    "/getListOrderByStatusCode",
    OrderController.getListOrderByStatusCode
  );
  return server.use("/userorder", router);
};

module.exports = orderRouter;
