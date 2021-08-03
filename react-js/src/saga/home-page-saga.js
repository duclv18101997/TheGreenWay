import { put, call } from "redux-saga/effects";
import HomePageActions from "../redux/home-page-redux";
import { message } from "antd";
import "antd/dist/antd.css";
import axios from "axios";

const HomePageSagas = {
  *userInformation() {
    try {
      const userInfor = yield call(async () => {
        return await axios.get("http://localhost:3001/user/information", {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": window.localStorage.getItem("x-access-token"),
          },
        });
      });
      if (!userInfor.data.success) {
        yield put(HomePageActions.getInforFailed(userInfor.data.message));
        message.error(userInfor.data.message, 3);
      } else {
        yield put(HomePageActions.getInforSucceed(userInfor.data.data));
      }
    } catch (error) {
      // message.error("Token không chính xác hoặc đã hết hạn sử dụng!", 3);
      // window.location.href = "/";
      window.localStorage.clear();
      yield put(HomePageActions.getInforFailed(error));
    }
  },

  // *checkStatusUser() {
  //   try {
  //     const userInfor = yield call(async () => {
  //       return await axios.get("http://localhost:3001/user/checkstatususer", {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-access-token": window.localStorage.getItem("x-access-token"),
  //         },
  //       });
  //     });
  //     if (!userInfor.data.success) {
  //       yield put(HomePageActions.getInforFailed(userInfor.data.message));
  //       message.error(userInfor.data.message, 3);
  //     } else {
  //       yield put(HomePageActions.getInforSucceed(userInfor.data.data));
  //     }
  //   } catch (error) {
  //     message.error("Token không chính xác hoặc đã hết hạn sử dụng!", 3);
  //     window.localStorage.clear();
  //     window.location.href = "/";
  //     yield put(HomePageActions.getInforFailed(error));
  //   }
  // },
};

export default HomePageSagas;
