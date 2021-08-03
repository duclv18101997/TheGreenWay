import { put, call } from "redux-saga/effects";
import ModActions from "../redux/mod-redux";
import { message } from "antd";
import "antd/dist/antd.css";
import axios from "axios";

const ModSagas = {
  *getUser(action) {
    try {
      const userInfor = yield call(() => {
        return axios.get("http://localhost:3001/mod/getListUser?page=1", {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": window.localStorage.getItem("x-access-token"),
          },
        });
      });
      if (!userInfor.data.success) {
        yield put(ModActions.getUserFailed(userInfor.data));
        message.error(userInfor.data.message, 3);
      } else {
        yield put(ModActions.getUserSucceed(userInfor.data));
      }
    } catch (error) {
      yield put(ModActions.getUserFailed(error));
    }
  },

  *upRole(action) {
    try {
      const userInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/mod/upRow?email=${action.data.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!userInfor.data.success) {
        yield put(ModActions.upRoleFailed(userInfor.data));
        message.error("Bạn không có quyền thực hiện!");
      } else {
        action.data.callback("success");
        message.success("Update is Success !");
        yield put(ModActions.upRoleSucceed(action.data.email));
      }
    } catch (error) {
      yield put(ModActions.upRoleFailed(error));
      message.error("Bạn không có quyền thực hiện!");
    }
  },

  *downRole(action) {
    try {
      const userInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/mod/dowRow?email=${action.data.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!userInfor.data.success) {
        yield put(ModActions.downRoleFailed(userInfor.data));
        message.error("Bạn không có quyền thực hiện!");
      } else {
        message.success("Update is Success !");
        yield put(ModActions.downRoleSucceed(action.data.email));
      }
    } catch (error) {
      message.error("Bạn không có quyền thực hiện!");
      yield put(ModActions.downRoleFailed(error));
    }
  },

  *unlockUser(action) {
    try {
      const userInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/mod/unlockUser?email=${action.data.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!userInfor.data.success) {
        yield put(ModActions.unlockFailed(userInfor.data));
        message.error("Bạn không có quyền thực hiện!");
      } else {
        message.success("Mở khóa tài khoản thành công");
        yield put(ModActions.unlockSucceed(action.data.email));
      }
    } catch (error) {
      message.error("Bạn không có quyền thực hiện!");
      yield put(ModActions.unlockFailed(error));
    }
  },

  *lockUser(action) {
    try {
      const userInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/mod/lockUser?email=${action.data.email}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!userInfor.data.success) {
        yield put(ModActions.lockFailed(userInfor.data));
        message.error("Bạn không có quyền thực hiện!");
      } else {
        message.success("Khóa tài khoản thành công!");
        yield put(ModActions.lockSucceed(action.data.email));
      }
    } catch (error) {
      message.error("Bạn không có quyền thực hiện!");
      yield put(ModActions.lockFailed(error));
    }
  },

  *getOrderList(action) {
    try {
      const orderHistoryInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/userorder/showOrderListForMOD`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!orderHistoryInfor.data.success) {
        yield put(ModActions.getListOrderFailed(orderHistoryInfor.data.data));
        message.error(orderHistoryInfor.data.message, 3);
      } else {
        yield put(ModActions.getListOrderSucceed(orderHistoryInfor.data.data));
      }
    } catch (error) {
      yield put(ModActions.getListOrderFailed(error));
    }
  },

  // changeStatusOrder
  *changeStatusOrder(action) {
    try {
      const params = {
        idOrder: action.data.idOrder,
        OrderStatusCode: `${action.data.status}`,
      };
      const orderHistoryInfor = yield call(() => {
        return axios.put(
          `http://localhost:3001/userorder/changeStatusOrder`,
          params,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });

      if (!orderHistoryInfor.data.success) {
        yield put(ModActions.changeStatusFailed(orderHistoryInfor.data.data));
        message.error(orderHistoryInfor.data.message, 3);
      } else {
        action.data.callback();
        yield put(ModActions.changeStatusSucceed(action));
        message.success(orderHistoryInfor.data.message, 3);
      }
    } catch (error) {
      yield put(ModActions.changeStatusFailed(error));
    }
  },
};

export default ModSagas;
