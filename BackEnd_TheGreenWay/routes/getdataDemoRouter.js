const express = require("express");
const router = express.Router();
const FriendController = require("../controllers/FriendController");
const AuthMiddleWare = require("../middlewares/AuthMiddleware");

let getdataDemoRouter = server => {
  // router.post("/refresh-token", AuthController.refreshToken);
  // Sử dụng authMiddleware.isAuth trước những api cần xác thực
  router.use(AuthMiddleWare.isAuth); // check token
  // List Protect APIs:
  router.get("/friends", FriendController.friendLists);
  return server.use("/demogetdata", router);
};

module.exports = getdataDemoRouter;
