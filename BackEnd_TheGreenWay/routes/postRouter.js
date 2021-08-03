const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ModMiddleware = require("../middlewares/ModMiddleware");

let postRouter = server => {
  // List Don't Need Protect APIs:
  router.get("/getpostbyid", PostController.getpostbyid);
  router.get("/getListPost", PostController.getListPost);
  router.post("/fulltextsearchPost", PostController.fulltextsearchPost);
  router.get("/getMuchLike", PostController.getMuchLike);
  // Check Token User
  router.use(AuthMiddleware.isAuth);
  // List Protect APIs:
  router.post("/likePost", PostController.likePost);
  router.get("/getListPostLike", PostController.getListPostLike);
  // Check Token MOD
  router.use(ModMiddleware.isAuth);
  // List Protect APIs:
  router.post("/addnewpost", PostController.addnewpost);
  router.put("/updatePost", PostController.updatePost);
  router.post("/addNewImagePost", PostController.addNewImagePost);
  router.delete("/removeImagePost", PostController.removeImagePost);
  router.delete("/deletePost", PostController.deletePost);
  return server.use("/post", router);
};

module.exports = postRouter;
