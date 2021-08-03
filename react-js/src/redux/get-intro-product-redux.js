import { createReducer, createActions } from "reduxsauce";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getIntroProductRequest: ["data"],
  getIntroProductRequestFailed: ["error"],
  getIntroProductSucceed: ["data"],
  getRecycleProductRequest: ["data"],
  getRecycleProductRequestFailed: ["error"],
  getRecycleProductSucceed: ["data"],
  updateLikeProduct: ["data"],
  updateLikeProductSucceed: ["data"],
  updateLikeProductFailed: ["error"],
  searchDefault: ["data"],
  searchDefaultSucceed: ["data"],
  searchDefaultFailed: ["error"],
  resetData: [],
  searchHigh: ["data"],
  searchHighSucceed: ["data"],
  searchHighFailed: ["error"],
  listProductSearch: ["data"],
  listProductSearchSucceed: ["data"],
  listProductSearchFailed: ["error"]
});

export const IntroProductTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  introProduct: [],
  recycleProduct: [],
  listProductSearch: [],
  totalPlantsPage: 0,
  totalRecyclePage: 0,
  resultsize: null,
  totalSearchPage: 0
};

export const request = state => {
  return {
    ...state
  };
};

export const getIntroProductSucceed = (state, { data }) => {
  return {
    ...state,
    introProduct: data.data,
    totalPlantsPage: data.totalPage
  };
};

export const getRecycleProductSucceed = (state, { data }) => {
  return {
    ...state,
    recycleProduct: data.data,
    totalRecyclePage: data.totalPage
  };
};

export const failed = (state, { error }) => {
  return {
    ...state
  };
};

export const getLikeProduct = (state, { data }) => {
  const method = data.method;
  const introProductNew = state.introProduct.map(el => {
    if (el.ProductID === data.idP) {
      return {
        ...el,
        NumberOfLikes:
          method === "like" ? el.NumberOfLikes + 1 : el.NumberOfLikes - 1,
        like: method === "like" ? "like" : "unLike"
      };
    }
    return el;
  });
  const recycleProduct = state.recycleProduct.map(el => {
    if (el.ProductID === data.idP) {
      return {
        ...el,
        NumberOfLikes:
          method === "like" ? el.NumberOfLikes + 1 : el.NumberOfLikes - 1,
        like: method === "like" ? "like" : "unLike"
      };
    }
    return el;
  });
  return {
    ...state,
    introProduct: introProductNew,
    recycleProduct: recycleProduct
  };
};

export const searchDefault = (state, data) => {
  return {
    ...state,
    introProduct: data.data.data,
    recycleProduct: data.data.data,
    resultsize: data.data.resultsize,
    totalPlantsPage: data.data.totalPage,
    totalRecyclePage: data.data.totalPage
  };
};

export const resetData = state => {
  return {
    ...state,
    resultsize: null
  };
};

export const failedSearch = (state, { error }) => {
  return {
    ...state,
    introProduct: [],
    recycleProduct: [],
    resultsize: 0,
    totalPlantsPage: 0,
    totalRecyclePage: 0
  };
};

export const listProductSearch = (state, { data }) => {
  return {
    ...state,
    listProductSearch: data.data
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [IntroProductTypes.GET_INTRO_PRODUCT_REQUEST]: request,
  [IntroProductTypes.GET_INTRO_PRODUCT_SUCCEED]: getIntroProductSucceed,
  [IntroProductTypes.GET_INTRO_PRODUCT_REQUEST_FAILED]: failed,
  [IntroProductTypes.GET_RECYCLE_PRODUCT_REQUEST]: request,
  [IntroProductTypes.GET_RECYCLE_PRODUCT_SUCCEED]: getRecycleProductSucceed,
  [IntroProductTypes.GET_RECYCLE_PRODUCT_REQUEST_FAILED]: failed,
  [IntroProductTypes.UPDATE_LIKE_PRODUCT]: request,
  [IntroProductTypes.UPDATE_LIKE_PRODUCT_SUCCEED]: getLikeProduct,
  [IntroProductTypes.UPDATE_LIKE_PRODUCT_FAILED]: failed,
  [IntroProductTypes.SEARCH_DEFAULT]: request,
  [IntroProductTypes.SEARCH_DEFAULT_SUCCEED]: searchDefault,
  [IntroProductTypes.SEARCH_DEFAULT_FAILED]: failedSearch,
  [IntroProductTypes.RESET_DATA]: resetData,
  [IntroProductTypes.SEARCH_HIGH]: request,
  [IntroProductTypes.SEARCH_HIGH_SUCCEED]: searchDefault,
  [IntroProductTypes.SEARCH_HIGH_FAILED]: failedSearch,
  [IntroProductTypes.LIST_PRODUCT_SEARCH]: request,
  [IntroProductTypes.LIST_PRODUCT_SEARCH_SUCCEED]: listProductSearch,
  [IntroProductTypes.LIST_PRODUCT_SEARCH_FAILED]: failed
});
