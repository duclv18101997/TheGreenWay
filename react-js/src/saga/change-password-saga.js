import { put, call } from "redux-saga/effects";
import ChangeActions from "../redux/change-password-redux";
import { message } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
const Cryptr = require("cryptr");
const cryptr = new Cryptr("thegreenway");

const ChangePassSagas = {
  *changePass(action) {
    try {
      const passInfor = yield call(async () => {
        return await axios.post(
          "http://localhost:3001/user/changepassword",
          {
            oldpassword: cryptr.encrypt(action.data.oldpassword),
            newpassword: cryptr.encrypt(action.data.newpassword),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!passInfor.data.success) {
        yield put(ChangeActions.changeFailed(passInfor.data));
        message.error(passInfor.data.message, 3);
      } else {
        yield put(ChangeActions.changeSucceed(passInfor.data));
        message.success(passInfor.data.message, 2);
      }
    } catch (error) {
      yield put(ChangeActions.changeFailed(error));
    }
  },
};

export default ChangePassSagas;
