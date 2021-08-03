import { createReducer, createActions } from "reduxsauce"

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  resetRequest: ['data'],
  resetSucceed: ['data'],
  resetFailed: ['error'],
  updateNotify: [],
})

export const ForgotTypes = Types
export default Creators

//TODO: Declare initial state
export const INITIAL_STATE = {
  resetMessage: false,
  notifyMessage: '',
}

export const request = (state) => {
  return {
    ...state,
  }
}

export const resetSucceed = (state, {data}) => {
  return {
    ...state,
    notifyMessage: data.message,
    resetMessage: data.success
  }
}

export const updateNotify = (state) => {
  return {
    ...state,
    notifyMessage: '',
    resetMessage: false
  }
}

export const failed = (state, { error }) => {

  return {
    ...state,
    resetMessage: error
  }
}

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [ForgotTypes.RESET_REQUEST]: request,
  [ForgotTypes.RESET_SUCCEED]: resetSucceed,
  [ForgotTypes.UPDATE_NOTIFY]: updateNotify,
  [ForgotTypes.RESET_FAILED]: failed,
})