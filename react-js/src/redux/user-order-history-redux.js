import { createReducer, createActions } from "reduxsauce";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getUserOrderRequest: ["data"],
  getUserOrderRequestFailed: ["error"],
  getUserOrderSucceed: ["data"],
  getUserOrderDetailRequest: ["data"],
  getUserOrderDetailRequestFailed: ["error"],
  getUserOrderDetailSucceed: ["data"],
  getUserOrderDetailIdRequest: ["data"],
  getUserOrderDetailIdRequestFailed: ["error"],
  getUserOrderDetailIdSucceed: ["data"],
  getOrderDetailByGuestRequest: ["data"],
  getOrderDetailByGuestRequestFailed: ["error"],
  getOrderDetailByGuestSucceed: ["data"],
});

export const UserOrderHistoryTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  orderCardList: [],
  totalPage: 0,
  orderDetail: [],
  cartInfor: "",
  guestCartInfor: "",
  cartGuestInfor: "",
};

export const request = (state) => {
  return {
    ...state,
  };
};

export const getUserOrderSucceed = (state, { data }) => {
  return {
    ...state,
    orderCardList: data.data,
    totalPage: data.totalPage,
  };
};

export const getUserOrderDetailSucceed = (state, { data }) => {
  return {
    ...state,
    orderDetail: data.cart,
    cartInfor: data.data,
  };
};

export const getUserOrderDetailIdSucceed = (state, { data }) => {
  return {
    ...state,
    orderDetail: data.cart,
    cartInfor: data.data,
  };
};

export const getOrderDetailByGuestSucceed = (state, { data }) => {
  return {
    ...state,
    orderDetail: data.cart,
    cartInfor: data.data,
  };
};

export const failed = (state, { error }) => {
  return {
    ...state,
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [UserOrderHistoryTypes.GET_USER_ORDER_REQUEST]: request,
  [UserOrderHistoryTypes.GET_USER_ORDER_SUCCEED]: getUserOrderSucceed,
  [UserOrderHistoryTypes.GET_USER_ORDER_REQUEST_FAILED]: failed,
  [UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_REQUEST]: request,
  [UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_SUCCEED]: getUserOrderDetailSucceed,
  [UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_REQUEST_FAILED]: failed,
  [UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_ID_REQUEST]: request,
  [UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_ID_SUCCEED]: getUserOrderDetailIdSucceed,
  [UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_ID_REQUEST_FAILED]: failed,
  [UserOrderHistoryTypes.GET_ORDER_DETAIL_BY_GUEST_REQUEST]: request,
  [UserOrderHistoryTypes.GET_ORDER_DETAIL_BY_GUEST_SUCCEED]: getOrderDetailByGuestSucceed,
  [UserOrderHistoryTypes.GET_ORDER_DETAIL_BY_GUEST_REQUEST_FAILED]: failed,
});
