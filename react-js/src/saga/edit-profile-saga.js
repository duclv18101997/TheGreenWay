import { put, call } from "redux-saga/effects";
import EditActions from "../redux/edit-profile";
import HomePageActions from "../redux/home-page-redux";
import { message } from "antd";
import "antd/dist/antd.css";
import axios from "axios";

const EditProfileSagas = {
  *editProfile(action) {
    try {
      const editInfor = yield call(async () => {
        return await axios.post(
          "http://localhost:3001/user/saveinformation",
          action.data,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token")
            }
          }
        );
      });
      if (!editInfor.data.success) {
        yield put(EditActions.editFailed(editInfor.data));
        message.error(editInfor.data.message, 3);
      } else {
        yield put(EditActions.editSucceed(editInfor.data));
        yield put(HomePageActions.getInforSucceedEdit(action.data));
        message.success("Cập nhật thông tin thành công", 2);
      }
    } catch (error) {
      yield put(EditActions.editFailed(error));
    }
  },

  *changeAvatar(action) {
    try {
      const changeAvatarInfor = yield call(async () => {
        return await axios.post(
          "http://localhost:3001/user/changeavatar",
          action.data,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token")
            }
          }
        );
      });
      if (!changeAvatarInfor.data.success) {
        yield put(EditActions.uploadFailed(changeAvatarInfor.data));
        message.error("Lưu ảnh đại diện không thành công", 3);
      } else {
        yield put(EditActions.uploadSucceed(changeAvatarInfor.data));
        yield put(HomePageActions.getInforSucceedAvatar(action.data));
        message.success("Lưu ảnh đại diện thành công", 2);
      }
    } catch (error) {
      yield put(EditActions.uploadFailed(error));
    }
  }
};

export default EditProfileSagas;
