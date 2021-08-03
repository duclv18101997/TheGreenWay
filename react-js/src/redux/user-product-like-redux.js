import { createReducer, createActions } from "reduxsauce"

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getProductLikeRequest: ['data'],
  getProductLikeRequestFailed: ['error'],
  getProductLikeSucceed: ['data'],
})

export const UserLikeProductTypes = Types
export default Creators

//TODO: Declare initial state
export const INITIAL_STATE = {
  likeProductList: [],
  totalPage : 0
}

export const request = (state) => {
  return {
    ...state,
  }
}

export const getProductLikeSucceed = (state, {data}) => {
  return {
    ...state,
    likeProductList: data.data,
    totalPage: data.totalPage
  }
}


export const failed = (state, { error }) => {
  return {
    ...state,
    likeProductList: []
  }
}

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [UserLikeProductTypes.GET_PRODUCT_LIKE_REQUEST]: request,
  [UserLikeProductTypes.GET_PRODUCT_LIKE_SUCCEED]: getProductLikeSucceed,
  [UserLikeProductTypes.GET_PRODUCT_LIKE_REQUEST_FAILED]: failed
})