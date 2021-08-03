import { combineReducers } from "redux";
import { reducer as modal } from "redux-modal";

const rootReducer = combineReducers({
  modal,
  sideBar: require("./side-bar-redux").reducer,
  userLogin: require("./login-redux").reducer,
  forgotPassword: require("./forgot-password-redux").reducer,
  editProfile: require("./edit-profile").reducer,
  changePass: require("./change-password-redux").reducer,
  homePage: require("./home-page-redux").reducer,
  introProduct: require("./get-intro-product-redux").reducer,
  convension: require("./paper-conversion-redux").reducer,
  productDetail: require("./product-detail-redux").reducer,
  lifeWay: require("./life-way-redux").reducer,
  userProductLike: require("./user-product-like-redux").reducer,
  userOrderHistory: require("./user-order-history-redux").reducer,
  orderCart: require("./order-card-redux").reducer,
  modReducers: require("./mod-redux").reducer,
  adminProduct: require('./admin-product-redux').reducer,
  adminPost: require('./admin-post-redux').reducer,
});


export default rootReducer;
