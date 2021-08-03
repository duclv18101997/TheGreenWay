const express = require('express');
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ModMiddleware = require("../middlewares/ModMiddleware"); 

let paymentRouter = (server) => {
    // List Don't Need Protect APIs:
    router.get("/getPayment", PaymentController.getPayment);
    // Check Token User
    router.use(AuthMiddleware.isAuth); 
    // List Protect APIs:
    // Check Token MOD
    router.use(ModMiddleware.isAuth); 
    router.post("/addNewPayment", PaymentController.addNewPayment);
    router.put("/updatePayment", PaymentController.updatePayment);
    router.delete("/detelePayment", PaymentController.detelePayment);
    // List Protect APIs:
    return server.use("/payment",router);
  }
  
module.exports = paymentRouter;