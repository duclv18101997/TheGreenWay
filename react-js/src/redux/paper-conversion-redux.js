import { createReducer, createActions } from "reduxsauce"

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  getConvensionRequest: ['data'],
  getConvensionRequestFailed: ['error'],
  getConvensionSucceed: ['data'],

  applyNewRateRequest: ['data'],
  applyNewRateFailed: ['data'],
  applyNewRateSucceed: ['data'],

  getConvensionDetailRequest: ['data'],
  getConvensionDetailFailed: ['error'],
  getConvensionDetailSucceed: ['data'],

  addConvensionRequest: ['data'],
  addConvensionFailed: ['error'],
  addConvensionSucceed: ['data'],

})

export const ConvensionTypes = Types
export default Creators

//TODO: Declare initial state
export const INITIAL_STATE = {
  convensionRate: '',
  conversionListWorking: [],
  conversionListNotWorking: [],
  convensionId: 0,
  conversionDetail: ''
}

export const request = (state) => {
  return {
    ...state,
  }
}

export const getConvensionSucceed = (state, {data}) => {
  return {
    ...state,
    conversionListWorking: [data.ConversionWorking],
    conversionListNotWorking: data.ConversionNotWorking,
    convensionRate: data.ConversionWorking.PaperPrice,
    convensionId: data.ConversionWorking.ConversionID
  }
}

export const getConvensionDetailSucceed = (state, {data}) => {
  return {
    ...state,
    conversionDetail: data.data
  }
}

export const applySucceed = (state, {data}) => {
  return {
    ...state,
  }
}

export const editConversionSucceed = (state, {data}) => {
  return {
    ...state,
  }
}

export const addConvensionSucceed = (state, {data}) => {
  return {
    ...state,
  }
}


export const failed = (state, { error }) => {
  return {
    ...state,
  }
}

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [ConvensionTypes.GET_CONVENSION_REQUEST]: request,
  [ConvensionTypes.GET_CONVENSION_SUCCEED]: getConvensionSucceed,
  [ConvensionTypes.GET_CONVENSION_REQUEST_FAILED]: failed,
  [ConvensionTypes.APPLY_NEW_RATE_REQUEST]: request,
  [ConvensionTypes.APPLY_NEW_RATE_SUCCEED]:  applySucceed,
  [ConvensionTypes.APPLY_NEW_RATE_FAILED]: failed,
  [ConvensionTypes.GET_CONVENSION_DETAIL_REQUEST]: request,
  [ConvensionTypes.GET_CONVENSION_DETAIL_SUCCEED]: getConvensionDetailSucceed,
  [ConvensionTypes.GET_CONVENSION_DETAIL_FAILED]: failed,
  [ConvensionTypes.ADD_CONVENSION_REQUEST]: request,
  [ConvensionTypes.ADD_CONVENSION_SUCCEED]: addConvensionSucceed,
  [ConvensionTypes.ADD_CONVENSION_FAILED]: failed,
})