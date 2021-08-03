import { createReducer, createActions } from "reduxsauce"

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getProductDetailRequest: ['data'],
  getProductDetailRequestFailed: ['error'],
  getProductDetailSucceed: ['data']
})

export const ProductDetailTypes = Types
export default Creators

//TODO: Declare initial state
export const INITIAL_STATE = {
  productInfor: {},
  productImages: []
}

export const request = (state) => {
  return {
    ...state,
  }
}

export const getProductDetailSucceed = (state, {data}) => {
  return {
    ...state,
    productInfor: data.data,
    productImages: data.images
  }
}
export const failed = (state, { error }) => {
  return {
    ...state,
  }
}

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [ProductDetailTypes.GET_PRODUCT_DETAIL_REQUEST]: request,
  [ProductDetailTypes.GET_PRODUCT_DETAIL_SUCCEED]: getProductDetailSucceed,
  [ProductDetailTypes.GET_PRODUCT_DETAIL_REQUEST_FAILED]: failed
})