import { createReducer, createActions } from "reduxsauce";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getInforRequest: [],
  getInforSucceed: ["data"],
  getInforSucceedEdit: ["data"],
  getInforSucceedAvatar: ["data"],
  getInforFailed: ["error"],
  updateStateCart: ["data"],
  updateValueCart: ["data"],
  updateNotify: []
});

export const HomePageTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  notifyMessage: "",
  userInformation: "",
  stateCartNumber: 0
};

export const request = state => {
  return {
    ...state
  };
};

export const getInforSucceed = (state, { data }) => {
  return {
    ...state,
    notifyMessage: data.message,
    userInformation: data
  };
};

export const getInforSucceedEdit = (state, data) => {
  return {
    ...state,
    userInformation: {
      ...state.userInformation,
      username: data.data.username
    }
  };
};

export const getInforSucceedAvatar = (state, data) => {
  return {
    ...state,
    userInformation: {
      ...state.userInformation,
      urlAvatar: data.data.urlAvatar
    }
  };
};

export const getInforSucceedImage = (state, data) => {
  return {
    ...state,
    userInformation: {
      ...state.userInformation,
      username: data.data.username
    }
  };
};

export const updateNotify = state => {
  return {
    ...state,
    notifyMessage: ""
  };
};

export const failed = (state, { error }) => {
  return {
    ...state
  };
};

export const updateStateCart = (state, { data }) => {
  return {
    ...state,
    stateCartNumber: data
  };
};

export const updateValueCart = (state, { data }) => {
  return {
    ...state,
    stateCartNumber: state.stateCartNumber + data
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [HomePageTypes.GET_INFOR_REQUEST]: request,
  [HomePageTypes.GET_INFOR_SUCCEED]: getInforSucceed,
  [HomePageTypes.GET_INFOR_SUCCEED_EDIT]: getInforSucceedEdit,
  [HomePageTypes.GET_INFOR_SUCCEED_AVATAR]: getInforSucceedAvatar,
  [HomePageTypes.GET_INFOR_FAILED]: failed,
  [HomePageTypes.UPDATE_NOTIFY]: updateNotify,
  [HomePageTypes.UPDATE_STATE_CART]: updateStateCart,
  [HomePageTypes.UPDATE_VALUE_CART]: updateValueCart
});
