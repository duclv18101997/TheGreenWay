import { put, call } from "redux-saga/effects";
import AdminProductActions from "../redux/admin-product-redux";
import { message } from "antd";
import axios from "axios";

const AdminProductSagas = {
  *getAdminProductInfor(action) {
    try {
      const productInfor = yield call(() => {
        return axios.get(`http://localhost:3001/product/getProducts`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      });
      if (!productInfor.data.success) {
        yield put(
          AdminProductActions.getProductRequestFailed(productInfor.data)
        );
        message.error(productInfor.data.message, 3);
      } else {
        yield put(AdminProductActions.getProductSucceed(productInfor.data));
      }
    } catch (error) {
      yield put(AdminProductActions.getProductRequestFailed(error));
    }
  },

  *getProductDetailInfor(action) {
    try {
      const productInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/product/getinfobyid?idProduct=${action.data.idProduct}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!productInfor.data.success) {
        yield put(
          AdminProductActions.getProductDetailAminRequestFailed(
            productInfor.data
          )
        );
        message.error(productInfor.data.message, 3);
      } else {
        yield put(
          AdminProductActions.getProductDetailAdminSucceed(productInfor.data)
        );
        action.data.callback();
      }
    } catch (error) {
      yield put(AdminProductActions.getProductDetailRequestAdminFailed(error));
    }
  },

  *updateProduct(action) {
    try {
      const productInfor = yield call(() => {
        return axios.put(
          `http://localhost:3001/product/updateProduct?idProduct=${action.data.params.idProduct}`,
          action.data.params,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      action.data.callback();
      if (!productInfor.data.success) {
        yield put(
          AdminProductActions.updateProductRequestFailed(productInfor.data)
        );
        message.error(productInfor.data.message, 3);
      } else {
        action.data.callback();
        yield put(AdminProductActions.updateProductSucceed(action.data));
        message.success(productInfor.data.message, 3);
      }
    } catch (error) {
      //yield put(AdminProductActions.updateProductRequestFailed(error));
    }
  },

  *deleteImageDetail(action) {
    try {
      const deleteImage = yield call(() => {
        return axios.delete(
          `http://localhost:3001/product/removeImageProduct?idImage=${action.data.idImage}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!deleteImage.data.success) {
        yield put(
          AdminProductActions.deleteImageDetailRequestFailed(deleteImage.data)
        );
        message.error(deleteImage.data.message, 3);
      } else {
        yield put(
          AdminProductActions.deleteImageDetailSucceed(action.data.idImage)
        );
        message.success(deleteImage.data.message, 3);
      }
    } catch (error) {
      yield put(AdminProductActions.deleteImageDetailRequestFailed(error));
    }
  },

  *updateImageDetail(action) {
    try {
      const addImage = yield call(() => {
        return axios.put(
          `http://localhost:3001/product/updateImageDetail`,
          {
            idImage: action.data.idImage,
            urlImage: action.data.urlImage,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!addImage.data.success) {
        yield put(
          AdminProductActions.updateImageDetailRequestFailed(addImage.data)
        );
        message.error(addImage.data.message, 3);
      } else {
        yield put(
          AdminProductActions.updateImageDetailSucceed({
            ...action.data,
          })
        );
        message.success("Thêm ảnh thành công", 3);
      }
    } catch (error) {
      yield put(AdminProductActions.updateImageDetailRequestFailed(error));
    }
  },

  *addImageDetail(action) {
    try {
      const addImage = yield call(() => {
        return axios.post(
          `http://localhost:3001/product/addNewImageProduct`,
          action.data,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!addImage.data.success) {
        yield put(
          AdminProductActions.addImageDetailRequestFailed(addImage.data)
        );
        message.error(addImage.data.message, 3);
      } else {
        yield put(
          AdminProductActions.addImageDetailSucceed({
            ...action.data,
            ...addImage,
          })
        );
        message.success("Thêm ảnh thành công", 3);
      }
    } catch (error) {
      yield put(AdminProductActions.addImageDetailRequestFailed(error));
    }
  },

  *addNewProduct(action) {
    try {
      const addProduct = yield call(() => {
        return axios.post(
          `http://localhost:3001/product/addNewProduct`,
          action.data.params,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!addProduct.data.success) {
        yield put(
          AdminProductActions.addNewProductRequestFailed(addProduct.data)
        );
        message.error(addProduct.data.message, 3);
      } else {
        action.data.callback(addProduct.data.idProduct);
        yield put(AdminProductActions.addNewProductSucceed(addProduct.data));
        message.success("Thêm sản phẩm thành công", 3);
      }
    } catch (error) {
      yield put(AdminProductActions.addNewProductRequestFailed(error));
    }
  },

  *addNewProductImage(action) {
    try {
      const imageProduct = yield call(() => {
        return axios.post(
          `http://localhost:3001/product/addNewImageProduct`,
          action.data,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!imageProduct.data.success) {
        yield put(
          AdminProductActions.addNewImageDetailRequestFailed(imageProduct.data)
        );
        message.error(imageProduct.data.message, 3);
      } else {
        yield put(
          AdminProductActions.addNewImageDetailSucceed(imageProduct.data)
        );
      }
    } catch (error) {
      yield put(AdminProductActions.addNewImageDetailRequestFailed(error));
    }
  },
};

export default AdminProductSagas;
