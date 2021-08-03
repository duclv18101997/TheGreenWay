import { put, call } from "redux-saga/effects";
import AdminPostActions from "../redux/admin-post-redux";
import { message } from "antd";
import "antd/dist/antd.css";
import axios from "axios";

const AdminPostSagas = {
  *getListPost(action) {
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
        yield put(AdminPostActions.getListPostFailed(postInfor.data));
        message.error(postInfor.data.message, 3);
      } else {
        yield put(AdminPostActions.getListPostSucceed(postInfor.data));
      }
    } catch (error) {
      yield put(AdminPostActions.getListPostFailed(error));
    }
  },

  *addNewPost(action) {
    try {
      const addPostInfor = yield call(() => {
        return axios.post(
          `http://localhost:3001/post/addnewpost`,
          action.data.params,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!addPostInfor.data.success) {
        yield put(AdminPostActions.addNewPostFailed(addPostInfor.data));
        message.error(addPostInfor.data.message, 3);
      } else {
        action.data.callback();
        yield put(AdminPostActions.addNewPostSucceed(addPostInfor.data));
        message.success("Đăng bài thành công", 3);
      }
    } catch (error) {
      yield put(AdminPostActions.addNewPostFailed(error));
    }
  },

  *getPostDetail(action) {
    try {
      const postDetail = yield call(() => {
        return axios.get(
          `http://localhost:3001/post/getpostbyid?idPost=${action.data.idPost}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!postDetail.data.success) {
        yield put(AdminPostActions.getPostDetailFailed(postDetail.data));
        message.error(postDetail.data.message, 3);
      } else {
        yield put(AdminPostActions.getPostDetailSucceed(postDetail.data));
        action.data.callback();
      }
    } catch (error) {
      yield put(AdminPostActions.getPostDetailFailed(error));
    }
  },

  *updatePost(action) {
    try {
      const updatePost = yield call(() => {
        return axios.put(
          `http://localhost:3001/post/updatePost?idPost=${action.data.params.idPost}`,
          action.data.params,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!updatePost.data.success) {
        yield put(AdminPostActions.updatePostFailed(updatePost.data));
        message.error(updatePost.data.message, 3);
      } else {
        yield put(AdminPostActions.updatePostSucceed(action.data));
        message.success("Cập nhật sản phẩm thành công", 3);
      }
    } catch (error) {
      yield put(AdminPostActions.updatePostFailed(error));
    }
  },
};

export default AdminPostSagas;
