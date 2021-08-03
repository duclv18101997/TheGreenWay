import { put, call } from "redux-saga/effects";
import UserOrderHistoryActions from "../redux/user-order-history-redux";
import { message } from "antd";
import axios from "axios";

const OrderHistorySagas = {
  *getOrderHistoryInfor(action) {
    try {
      const orderHistoryInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/userorder/showOrderListByEmail?page=${action.data.page}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!orderHistoryInfor.data.success) {
        yield put(
          UserOrderHistoryActions.getUserOrderRequestFailed(
            orderHistoryInfor.data
          )
        );
        message.error(orderHistoryInfor.data.message, 3);
      } else {
        yield put(
          UserOrderHistoryActions.getUserOrderSucceed(orderHistoryInfor.data)
        );
      }
    } catch (error) {
      yield put(UserOrderHistoryActions.getUserOrderRequestFailed(error));
    }
  },

  *getOrderDetailInfor(action) {
    try {
      const params = action.data;
      const orderDetailInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/userorder/showOrderByEmail?idOrder=${action.data.idOrder}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!orderDetailInfor.data.success) {
        yield put(
          UserOrderHistoryActions.getUserOrderDetailRequestFailed(
            orderDetailInfor.data
          )
        );
        message.error(orderDetailInfor.data.message, 3);
      } else {
        yield put(
          UserOrderHistoryActions.getUserOrderDetailSucceed(
            orderDetailInfor.data
          )
        );
      }
    } catch (error) {
      yield put(UserOrderHistoryActions.getUserOrderDetailRequestFailed(error));
    }
  },

  *getOrderDetailIdInfor(action) {
    try {
      const orderDetailInfor = yield call(() => {
        return axios.get(
          `http://localhost:3001/userorder/showOrderByID?idOrder=${action.data}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": window.localStorage.getItem("x-access-token"),
            },
          }
        );
      });
      if (!orderDetailInfor.data.success) {
        yield put(
          UserOrderHistoryActions.getUserOrderDetailIdRequestFailed(
            orderDetailInfor.data
          )
        );
        message.error(orderDetailInfor.data.message, 3);
      } else {
        yield put(
          UserOrderHistoryActions.getUserOrderDetailIdSucceed(
            orderDetailInfor.data
          )
        );
      }
    } catch (error) {
      yield put(
        UserOrderHistoryActions.getUserOrderDetailIdRequestFailed(error)
      );
    }
  },

  *getOrderDetailInforGuest(action) {
    try {
      const params = action.data;
      const orderDetailInfor = yield call(() => {
        return axios.post(
          `http://localhost:3001/guest/showOrderByToken`,
          params,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });
      if (!orderDetailInfor.data.success) {
        yield put(
          UserOrderHistoryActions.getOrderDetailByGuestRequestFailed(
            orderDetailInfor.data
          )
        );
        message.error(orderDetailInfor.data.message, 3);
      } else {
        yield put(
          UserOrderHistoryActions.getOrderDetailByGuestSucceed(
            orderDetailInfor.data
          )
        );
      }
    } catch (error) {
      yield put(
        UserOrderHistoryActions.getOrderDetailByGuestRequestFailed(error)
      );
    }
  },
};

export default OrderHistorySagas;
