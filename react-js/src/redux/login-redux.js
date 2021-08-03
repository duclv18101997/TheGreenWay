import { createReducer, createActions } from "reduxsauce";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  loginRequest: ["data"],
  loginSucceed: ["data"],
  loginFailed: ["error"],
  signUpRequest: ["data"],
  signUpSucceed: ["data"],
  signUpFailed: ["error"],
  forgotRequest: ["data"],
  forgotSucceed: ["data"],
  forgotFailed: ["error"],
  updateNotify: [],
  logout: [],
});

export const LoginTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  forgotMessage: "",
  forgotMessageError: "",
  loginSuccess: false,
  registerSuccess: false,
  forgotSuccess: false,
  userInfor: "",
  notifyMessage: "",
};

export const request = (state) => {
  return {
    ...state,
  };
};

export const loginSucceed = (state, { data }) => {
  return {
    ...state,
    loginSuccess: data.success,
    notifyMessage: data.success,
  };
};

export const signUpSucceed = (state, { data }) => {
  return {
    ...state,
    loginSuccess: false,
    registerSuccess: data.success,
    notifyMessage: data.message,
  };
};

export const forgotSucceed = (state, { data }) => {
  return {
    ...state,
    forgotSuccess: data.success,
    notifyMessage: data.message,
  };
};

export const logout = (state) => {
  return {
    ...state,
  };
};

export const updateNotify = (state) => {
  return {
    ...state,
    notifyMessage: "",
    registerSuccess: false,
    loginSucceess: false,
    forgotSuccess: false,
  };
};

export const failed = (state, { error }) => {
  return {
    ...state,
    forgotMessage: error,
    loginSuccess: error.success,
    registerSuccess: error.success,
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [LoginTypes.LOGIN_REQUEST]: request,
  [LoginTypes.LOGIN_SUCCEED]: loginSucceed,
  [LoginTypes.LOGIN_FAILED]: failed,
  [LoginTypes.SIGN_UP_REQUEST]: request,
  [LoginTypes.SIGN_UP_SUCCEED]: signUpSucceed,
  [LoginTypes.SIGN_UP_FAILED]: failed,
  [LoginTypes.FORGOT_REQUEST]: request,
  [LoginTypes.FORGOT_SUCCEED]: forgotSucceed,
  [LoginTypes.UPDATE_NOTIFY]: updateNotify,
  [LoginTypes.FORGOT_FAILED]: failed,
  [LoginTypes.LOGOUT]: logout,
});
