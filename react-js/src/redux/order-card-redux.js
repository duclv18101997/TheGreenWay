import { createReducer, createActions } from "reduxsauce";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getOrderCartRequest: ["data"],
  getOrderCartRequestFailed: ["error"],
  getOrderCartSucceed: ["data"],
  getInforNumberRequest: [],
  getInforNumberRequestFailed: ["error"],
  getInforNumberSucceed: ["data"],
  guestToken: "",
});

export const OrderCartTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  inforAbout: "",
};

export const request = (state) => {
  return {
    ...state,
  };
};

export const getOrderCartSucceed = (state, { data }) => {
  return {
    ...state,
  };
};

export const getInforAboutSucceed = (state, { data }) => {
  // console.log(data)
  return {
    ...state,
    inforAbout: data.data,
  };
};

export const failed = (state, { error }) => {
  return {
    ...state,
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [OrderCartTypes.GET_ORDER_CART_REQUEST]: request,
  [OrderCartTypes.GET_ORDER_CART_SUCCEED]: getOrderCartSucceed,
  [OrderCartTypes.GET_ORDER_CART_REQUEST_FAILED]: failed,
  [OrderCartTypes.GET_INFOR_NUMBER_REQUEST]: request,
  [OrderCartTypes.GET_INFOR_NUMBER_SUCCEED]: getInforAboutSucceed,
  [OrderCartTypes.GET_INFOR_NUMBER_REQUEST_FAILED]: failed,
});
