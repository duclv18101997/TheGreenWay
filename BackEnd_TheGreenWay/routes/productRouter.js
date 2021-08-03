const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ModMiddleware = require("../middlewares/ModMiddleware");

let productRouter = (server) => {
  // List Don't Need Protect APIs:
  router.get("/getinfobyid", ProductController.getinfobyid);
  router.get("/getProductsByCategory", ProductController.getProductsByCategory);
  router.get("/getProducts", ProductController.getProducts);
  router.post(
    "/fulltextsearchProduct",
    ProductController.fulltextsearchProduct
  );
  router.post("/searchProduct", ProductController.searchProduct);
  router.get("/getinfosearchProduct", ProductController.getinfosearchProduct);
  router.get(
    "/getInfoProductFromCart",
    ProductController.getInfoProductFromCart
  );
  router.get(
    "/getProductAllByCategory",
    ProductController.getProductAllByCategory
  );
  // Check Token User
  router.use(AuthMiddleware.isAuth);
  // List Protect APIs:
  router.post("/likeProduct", ProductController.likeProduct);
  router.get("/getListProductLike", ProductController.getListProductLike);
  // Check Token MOD
  router.use(ModMiddleware.isAuth);
  // List Protect APIs:updateImageDetail
  router.get("/getProductsStatus", ProductController.getProductsStatus);
  router.post("/addNewProduct", ProductController.addNewProduct);
  router.put("/updateProduct", ProductController.updateProduct);
  router.put("/updateImageDetail", ProductController.updateImageDetail);
  router.post("/addNewImageProduct", ProductController.addNewImageProduct);
  router.delete("/removeImageProduct", ProductController.removeImageProduct);
  router.delete("/deleteProduct", ProductController.deleteProduct);
  router.put("/updateQuatityProduct", ProductController.updateQuatityProduct);

  return server.use("/product", router);
};

module.exports = productRouter;
