import { put, call } from "redux-saga/effects";
import IntroProductActions from "../redux/get-intro-product-redux";
import { message } from "antd";
import axios from "axios";

const IntroProductSagas = {
  *getIntroProduct(action) {
    try {
      const productInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/product/getProductsByCategory?idCategory=${
            action.data.idCategory
          }&page=${action.data.page}&email=${
            window.localStorage.getItem("email") || ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!productInfor.data.success) {
        yield put(
          IntroProductActions.getIntroProductRequestFailed(productInfor.data)
        );
        message.error(productInfor.data.message, 3);
      } else {
        yield put(
          IntroProductActions.getIntroProductSucceed(productInfor.data)
        );
      }
    } catch (error) {
      yield put(IntroProductActions.getIntroProductRequestFailed(error));
    }
  },

  *getRecycleProduct(action) {
    try {
      const productInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/product/getProductsByCategory?idCategory=${
            action.data.idCategory
          }&page=${action.data.page}&email=${
            window.localStorage.getItem("email") || ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!productInfor.data.success) {
        yield put(
          IntroProductActions.getRecycleProductRequestFailed(productInfor.data)
        );
        message.error(productInfor.data.message, 3);
      } else {
        yield put(
          IntroProductActions.getRecycleProductSucceed(productInfor.data)
        );
      }
    } catch (error) {
      yield put(IntroProductActions.getRecycleProductRequestFailed(error));
    }
  },

  *getListSearchProduct(action) {
    try {
      const productInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/product/getProductAllByCategory?cate=${action.data.idCategory}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!productInfor.data.success) {
        yield put(
          IntroProductActions.listProductSearchFailed(productInfor.data)
        );
        message.error(productInfor.data.message, 3);
      } else {
        yield put(
          IntroProductActions.listProductSearchSucceed(productInfor.data)
        );
      }
    } catch (error) {
      yield put(IntroProductActions.listProductSearchFailed(error));
    }
  },

  *updateLikeProduct(action) {
    //Magic
    const params = {
      email: "cuong1234@gmail.com",
    };
    try {
      const productInfor = yield call(() => {
        return axios.post(
          `http://localhost:3001/product/likeProduct?id=${action.data.idP}`,
          params,
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
          IntroProductActions.updateLikeProductFailed(productInfor.data)
        );
        message.error(productInfor.data.message, 3);
      } else {
        yield put(
          IntroProductActions.updateLikeProductSucceed({
            mess: productInfor.data,
            method: action.data.method,
            idP: action.data.idP,
          })
        );
      }
    } catch (error) {
      yield put(IntroProductActions.updateLikeProductFailed(error));
    }
  },

  *searchDefault(action) {
    let textName = action.data.value.split("`").join("");
    textName = textName.split(`'`).join("");
    textName = textName.split(`"`).join("");
    textName = textName.split(`*`).join("");
    const params = {
      fulltextsearch: textName,
    };
    try {
      const productInfor = yield call(() => {
        return axios.post(
          `http://localhost:3001/product/fulltextsearchProduct?page=${
            action.data.page
          }&category=${action.data.cate}&email=${
            window.localStorage.getItem("email") || ""
          }`,
          params,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!productInfor.data.success) {
        yield put(IntroProductActions.searchDefaultFailed(productInfor));
        message.error(productInfor.data.message, 3);
      } else {
        yield put(IntroProductActions.searchDefaultSucceed(productInfor.data));
      }
    } catch (error) {
      yield put(IntroProductActions.searchDefaultFailed(error));
    }
  },

  *searchHigh(action) {
    let textName = action.data.value.textName.split("`").join("");
    textName = textName.split(`'`).join("");
    textName = textName.split(`"`).join("");

    let params = {
      ProductName: textName.toLowerCase(),
      MaxPrice: action.data.value.maxP,
      MinPrice: action.data.value.minP,
    };
    const regex = /[\_\%]/g;
    let newtext = textName;
    const found = newtext.match(regex);
    if (found) {
      found.map((el) => (newtext = newtext.replace(el, `!${el}`)));
      params = {
        ...params,
        ProductName: newtext.toLowerCase(),
      };
    }
    try {
      const productInfor = yield call(() => {
        return axios.post(
          `http://localhost:3001/product/searchProduct?page=${
            action.data.page
          }&category=${action.data.cate}&email=${
            window.localStorage.getItem("email") || ""
          }`,
          params,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!productInfor.data.success) {
        yield put(IntroProductActions.searchHighFailed(productInfor));
        message.error(productInfor.data.message, 3);
      } else {
        yield put(IntroProductActions.searchHighSucceed(productInfor.data));
      }
    } catch (error) {
      yield put(IntroProductActions.searchHighFailed(error));
    }
  },
};

export default IntroProductSagas;
