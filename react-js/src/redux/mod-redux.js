import { createReducer, createActions } from "reduxsauce";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getUserRequest: ["data"],
  getUserSucceed: ["data"],
  getUserFailed: ["error"],
  deleteUserRequest: ["data"],
  deleteUserSucceed: ["data"],
  deleteUserFailed: ["error"],
  upRoleRequest: ["data"],
  upRoleSucceed: ["data"],
  upRoleFailed: ["error"],
  downRoleRequest: ["data"],
  downRoleSucceed: ["data"],
  downRoleFailed: ["error"],
  getListOrderRequest: ["data"],
  getListOrderSucceed: ["data"],
  getListOrderFailed: ["error"],
  lockRequest: ["data"],
  lockSucceed: ["data"],
  lockFailed: ["error"],
  unlockRequest: ["data"],
  unlockSucceed: ["data"],
  unlockFailed: ["error"],
  changeStatusRequest: ["data"],
  changeStatusSucceed: ["data"],
  changeStatusFailed: ["error"],
});

export const ModTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  listUser: "",
  listOrder: "",
};

export const request = (state) => {
  return {
    ...state,
    // notifyMessage: "",
  };
};

export const getUserSuccee = (state, { data }) => {
  return {
    ...state,
    listUser: data.data,
  };
};

export const upRoleSuccee = (state, { data }) => {
  return {
    ...state,
    listUser: state.listUser.map((el) => {
      if (el.email === data) {
        return {
          ...el,
          roles: "mod",
        };
      }
      return el;
    }),
  };
};

export const downRoleSuccee = (state, { data }) => {
  return {
    ...state,
    listUser: state.listUser.map((el) => {
      if (el.email === data) {
        return {
          ...el,
          roles: "user",
        };
      }
      return el;
    }),
  };
};

export const failed = (state, { error }) => {
  return {
    ...state,
  };
};

export const getListOrderSuccess = (state, { data }) => {
  return {
    ...state,
    listOrder: data,
  };
};

export const lockSuccess = (state, { data }) => {
  return {
    ...state,
    listUser: state.listUser.map((el) => {
      if (el.email === data) {
        return {
          ...el,
          status: "lock",
        };
      }
      return el;
    }),
  };
};

export const unLockSuccess = (state, { data }) => {
  return {
    ...state,
    listUser: state.listUser.map((el) => {
      if (el.email === data) {
        return {
          ...el,
          status: "ok",
        };
      }
      return el;
    }),
  };
};

export const changeStatusSuccess = (state, { data }) => {
  let stringS = "";
  let endDate = "Invalid date";
  if (data.data.status === 1) {
    stringS = "Đang Chờ Xử Lý";
  }
  if (data.data.status === 2) {
    stringS = "Đang Giao Hàng";
  }
  if (data.data.status === 3) {
    stringS = "Giao Hàng Thành Công";
    endDate = new Date();
  }
  if (data.data.status === 4) {
    stringS = "Đơn Hàng Bị Huỷ";
    endDate = new Date();
  }
  return {
    ...state,
    listOrder: state.listOrder.map((el) => {
      if (el.OrderID === data.data.idOrder) {
        return {
          ...el,
          Description: stringS,
          EndDate: endDate,
        };
      }
      return el;
    }),
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [ModTypes.GET_USER_REQUEST]: request,
  [ModTypes.GET_USER_SUCCEED]: getUserSuccee,
  [ModTypes.GET_USER_FAILED]: failed,
  [ModTypes.UP_ROLE_REQUEST]: request,
  [ModTypes.UP_ROLE_SUCCEED]: upRoleSuccee,
  [ModTypes.UP_ROLE_FAILED]: failed,
  [ModTypes.DOWN_ROLE_REQUEST]: request,
  [ModTypes.DOWN_ROLE_SUCCEED]: downRoleSuccee,
  [ModTypes.DOWN_ROLE_FAILED]: failed,
  [ModTypes.GET_LIST_ORDER_REQUEST]: request,
  [ModTypes.GET_LIST_ORDER_SUCCEED]: getListOrderSuccess,
  [ModTypes.GET_LIST_ORDER_FAILED]: failed,
  [ModTypes.LOCK_REQUEST]: request,
  [ModTypes.LOCK_SUCCEED]: lockSuccess,
  [ModTypes.LOCK_FAILED]: failed,
  [ModTypes.UNLOCK_REQUEST]: request,
  [ModTypes.UNLOCK_SUCCEED]: unLockSuccess,
  [ModTypes.UNLOCK_FAILED]: failed,
  [ModTypes.CHANGE_STATUS_REQUEST]: request,
  [ModTypes.CHANGE_STATUS_SUCCEED]: changeStatusSuccess,
  [ModTypes.CHANGE_STATUS_FAILED]: failed,
});
