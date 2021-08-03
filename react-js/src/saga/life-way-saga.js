import { put, call } from "redux-saga/effects";
import LifeWayActions from "../redux/life-way-redux";
import { message } from "antd";
import axios from "axios";

const LifeWaySagas = {
  *getPostInfor(action) {
    console.log('vao saga post')
    try {
      const postInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/post/getListPost?page=${
            action.data.page
          }&email=${window.localStorage.getItem("email") || ""}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!postInfor.data.success) {
        yield put(LifeWayActions.getLifeWayRequestFailed(postInfor.data));
        message.error(postInfor.data.message, 3);
      } else {
        yield put(LifeWayActions.getLifeWaySucceed(postInfor.data));
      }
    } catch (error) {
      yield put(LifeWayActions.getLifeWayRequestFailed(error));
    }
  },

  *getPostDetailInfor(action) {
    try {
      const postDetailInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/post/getpostbyid?idPost=${action.data}&email=${
            window.localStorage.getItem("email") || ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!postDetailInfor.data.success) {
        yield put(
          LifeWayActions.getLifeWayDetailRequestFailed(postDetailInfor.data)
        );
        message.error(postDetailInfor.data.message, 3);
      } else {
        yield put(LifeWayActions.getLifeWayDetailSucceed(postDetailInfor.data));
      }
    } catch (error) {
      yield put(LifeWayActions.getLifeWayDetailRequestFailed(error));
    }
  },

  *likePost(action) {
    const params = {
      email: "cuong1234@gmail.com",
    };
    try {
      const postDetailInfor = yield call(() => {
        return axios.post(
          `http://localhost:3001/post/likePost?idPost=${action.data.idP}`,
          params,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!postDetailInfor.data.success) {
        yield put(
          LifeWayActions.getLifeWayLikeRequestFailed(postDetailInfor.data)
        );
        message.error(postDetailInfor.data.message, 3);
      } else {
        yield put(LifeWayActions.getLifeWayLikeSucceed(action));
      }
    } catch (error) {
      yield put(LifeWayActions.getLifeWayLikeRequestFailed(error));
    }
  },

  *searchPost(action) {
    let textName = action.data.value.split("`").join("");
    textName = textName.split(`'`).join("");
    textName = textName.split(`"`).join("");
    textName = textName.split(`*`).join("");
    const params = {
      fulltextsearch: textName,
    };
    try {
      const postInfor = yield call(() => {
        return axios.post(
          `http://localhost:3001/post/fulltextsearchPost?page=${
            action.data.page
          }&email=${window.localStorage.getItem("email") || ""}`,
          params,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!postInfor.data.success) {
        yield put(LifeWayActions.getLifeWaySearchRequestFailed(postInfor));
        message.error(postInfor.data.message, 3);
      } else {
        yield put(LifeWayActions.getLifeWaySearchSucceed(postInfor.data));
      }
    } catch (error) {
      yield put(LifeWayActions.getLifeWaySearchRequestFailed(error));
    }
  },

  *getPostLikeMuch(action) {
    try {
      const postInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/post/getMuchLike?email=${
            window.localStorage.getItem("email") || ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!postInfor.data.success) {
        yield put(LifeWayActions.getPostLikeMuchFailed(postInfor));
        message.error(postInfor.data.message, 3);
      } else {
        yield put(LifeWayActions.getPostLikeMuchSucceed(postInfor.data));
      }
    } catch (error) {
      yield put(LifeWayActions.getPostLikeMuchFailed(error));
    }
  },
};

export default LifeWaySagas;
