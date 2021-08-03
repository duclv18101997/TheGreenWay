const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

let userRouter = (server) => {
  // router.post("/refresh-token", AuthController.refreshToken);
  // Sử dụng authMiddleware.isAuth trước những api cần xác thực
  router.use(AuthMiddleware.isAuth); // check token
  // List Protect APIs:
  router.get("/information", UserController.information);
  router.post("/saveinformation", UserController.saveinformation);
  router.post("/changeavatar", UserController.changeavatar);
  router.post("/changepassword", UserController.changepassword);
  router.get("/checkstatususer", UserController.checkStatusUser);
  return server.use("/user", router);
};

module.exports = userRouter;
