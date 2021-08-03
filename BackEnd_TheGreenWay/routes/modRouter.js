const express = require("express");
const router = express.Router();
const ModController = require("../controllers/ModController");
const ModMiddleware = require("../middlewares/ModMiddleware");
const AdminMiddleware = require("../middlewares/AdminMiddleware");

let modRouter = (server) => {
  // router.post("/refresh-token", AuthController.refreshToken);
  // Sử dụng authMiddleware.isAuth trước những api cần xác thực
  router.use(ModMiddleware.isAuth); // check token
  // List Protect APIs:
  router.get("/getListUser", ModController.getListUser);
  router.use(AdminMiddleware.isAuth);
  router.get("/upRow", ModController.upRow);
  router.get("/dowRow", ModController.downRow);
  router.get("/lockUser", ModController.lockUser);
  router.get("/unlockUser", ModController.unlockUser);
  return server.use("/mod", router);
};

module.exports = modRouter;
