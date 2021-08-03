import { put, call } from "redux-saga/effects";
import UserProductLikeActions from "../redux/user-product-like-redux";
import { message } from "antd";
import axios from "axios";

const ProductLikeSagas = {
  *getProductLikeInfor(action) {
    try {
      const productLikeInfor = yield call(() => {
        return axios.get(`http://localhost:3001/product/getListProductLike?page=${action.data.page}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': window.localStorage.getItem("x-access-token"),
          },
        });
      });
      if (!productLikeInfor.data.success) {
        yield put(UserProductLikeActions.getProductLikeRequestFailed(productLikeInfor.data));
        message.error(productLikeInfor.data.message, 3);
      } else {
        yield put(UserProductLikeActions.getProductLikeSucceed(productLikeInfor.data));
      }
    } catch (error) {
      yield put(UserProductLikeActions.getProductLikeRequestFailed(error));
    }
  },
};

export default ProductLikeSagas;
