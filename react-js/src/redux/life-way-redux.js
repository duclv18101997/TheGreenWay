import { createReducer, createActions } from "reduxsauce";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getLifeWayRequest: ["data"],
  getLifeWayRequestFailed: ["error"],
  getLifeWaySucceed: ["data"],
  getLifeWayDetailRequest: ["data"],
  getLifeWayDetailRequestFailed: ["error"],
  getLifeWayDetailSucceed: ["data"],
  getLifeWayLikeRequest: ["data"],
  getLifeWayLikeRequestFailed: ["error"],
  getLifeWayLikeSucceed: ["data"],
  getLifeWaySearchRequest: ["data"],
  getLifeWaySearchRequestFailed: ["error"],
  getLifeWaySearchSucceed: ["data"],
  getPostLikeMuch: ["data"],
  getPostLikeMuchSucceed: ["data"],
  getPostLikeMuchFailed: ["error"],
  setCheckSearchTrue: ['data'],
  setCheckSearchFalse: ['data']
});

export const LifeWayTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  postInfor: [],
  postDetailInfor: [],
  totalPostPage: 0,
  resultSearch: null,
  postLikeMuch: {},
  checkSearch: false
};

export const request = state => {
  console.log("vao request ")
  return {
    ...state
  };
};

export const getLifeWaySucceed = (state, { data }) => {
  console.log("vao success ")
  return {
    ...state,
    postInfor: data.data,
    totalPostPage: data.totalPage,
    resultSearch: null
  };
};

export const getLifeWayDetailSucceed = (state, { data }) => {
  return {
    ...state,
    postDetailInfor: data.data
  };
};

export const failed = (state, { error }) => {
  return {
    ...state
  };
};

export const getLikePost = (state, data) => {
  const method = data.data.data.method;
  const postInforNew = state.postInfor.map(el => {
    if (el.PostID === data.data.data.idP) {
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
    postLikeMuch:
      state.postLikeMuch.PostID === data.data.data.idP
        ? {
            ...state.postLikeMuch,
            NumberOfLikes:
              method === "like"
                ? state.postLikeMuch.NumberOfLikes + 1
                : state.postLikeMuch.NumberOfLikes - 1,
            like: method === "like" ? "like" : "unLike"
          }
        : state.postLikeMuch,
    postInfor: postInforNew
  };
};

export const searchDefaultPost = (state, { data }) => {
  return {
    ...state,
    postInfor: data.data,
    totalPostPage: data.totalPage,
    resultSearch: data.resultsize
  };
};

export const searchFail = (state, { data }) => {
  return {
    ...state,
    postInfor: [],
    totalPostPage: 0,
    resultSearch: 0
  };
};

export const getPostLikeMuchP = (state, { data }) => {
  return {
    ...state,
    postLikeMuch: data.data
  };
};

export const checkSearchTrue = (state, { data }) => {
  return {
    ...state,
    checkSearch: true
  };
};

export const checkSearchFalse = (state, { data }) => {
  return {
    ...state,
    checkSearch: false
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [LifeWayTypes.GET_LIFE_WAY_REQUEST]: request,
  [LifeWayTypes.GET_LIFE_WAY_SUCCEED]: getLifeWaySucceed,
  [LifeWayTypes.GET_LIFE_WAY_REQUEST_FAILED]: failed,
  [LifeWayTypes.GET_LIFE_WAY_DETAIL_REQUEST]: request,
  [LifeWayTypes.GET_LIFE_WAY_DETAIL_SUCCEED]: getLifeWayDetailSucceed,
  [LifeWayTypes.GET_LIFE_WAY_DETAIL_REQUEST_FAILED]: failed,
  [LifeWayTypes.GET_LIFE_WAY_LIKE_REQUEST]: request,
  [LifeWayTypes.GET_LIFE_WAY_LIKE_SUCCEED]: getLikePost,
  [LifeWayTypes.GET_LIFE_WAY_LIKE_REQUEST_FAILED]: failed,
  [LifeWayTypes.GET_LIFE_WAY_SEARCH_REQUEST]: request,
  [LifeWayTypes.GET_LIFE_WAY_SEARCH_SUCCEED]: searchDefaultPost,
  [LifeWayTypes.GET_LIFE_WAY_SEARCH_REQUEST_FAILED]: searchFail,
  [LifeWayTypes.GET_POST_LIKE_MUCH]: request,
  [LifeWayTypes.GET_POST_LIKE_MUCH_SUCCEED]: getPostLikeMuchP,
  [LifeWayTypes.GET_POST_LIKE_MUCH_FAILED]: failed,
  [LifeWayTypes.SET_CHECK_SEARCH_TRUE]: checkSearchTrue,
  [LifeWayTypes.SET_CHECK_SEARCH_FALSE]: checkSearchFalse
});
