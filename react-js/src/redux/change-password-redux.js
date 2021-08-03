import { createReducer, createActions } from "reduxsauce"

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  changeRequest: ['data'],
  changeSucceed: ['data'],
  changeFailed: ['error'],
  updateNotify: [],
})

export const ChangePassTypes = Types
export default Creators

//TODO: Declare initial state
export const INITIAL_STATE = {
  notifyMessage: '',
  changeMessage: false
}

export const request = (state) => {
  return {
    ...state,
  }
}

export const changeSucceed = (state, {data}) => {
  return {
    ...state,
    notifyMessage: data.message,
    changeMessage: data.success
  }
}

export const updateNotify = (state) => {
  return {
    ...state,
    notifyMessage: '',
    changeMessage: false
  }
}

export const failed = (state, { error }) => {
  return {
    ...state,
  }
}

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [ChangePassTypes.CHANGE_REQUEST]: request,
  [ChangePassTypes.CHANGE_SUCCEED]: changeSucceed,
  [ChangePassTypes.CHANGE_FAILED]: failed,
  [ChangePassTypes.UPDATE_NOTIFY]: updateNotify,
})