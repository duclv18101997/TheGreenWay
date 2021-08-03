import { takeLatest, all } from "redux-saga/effects";
import { LoginTypes } from "../redux/login-redux";
import { ForgotTypes } from "../redux/forgot-password-redux";
import { HomePageTypes } from "../redux/home-page-redux";
import { EditTypes } from "../redux/edit-profile";
import { ChangePassTypes } from "../redux/change-password-redux";
import { IntroProductTypes } from "../redux/get-intro-product-redux";
import { ConvensionTypes } from "../redux/paper-conversion-redux";
import { ProductDetailTypes } from "../redux/product-detail-redux";
import { LifeWayTypes } from "../redux/life-way-redux";
import { UserLikeProductTypes } from "../redux/user-product-like-redux";
import { UserOrderHistoryTypes } from "../redux/user-order-history-redux";
import { OrderCartTypes } from "../redux/order-card-redux";
import { ModTypes } from "../redux/mod-redux";
import { AdminProductTypes } from "../redux/admin-product-redux";
import { AdminPostTypes } from "../redux/admin-post-redux";
import LoginSagas from "./login-saga";
import ResetPassword from "./reset-password";
import HomePageSagas from "./home-page-saga";
import EditProfileSagas from "./edit-profile-saga";
import ChangePassSagas from "./change-password-saga";
import IntroProductSagas from "./intro-product-saga";
import PaperConvensionSagas from "./paper-convension-saga";
import ProductDetailSagas from "./product-detail-saga";
import LifeWaySagas from "./life-way-saga";
import UserProductLikeSagas from "./user-product-like-saga";
import UserOrderHistorySagas from "./user-order-history-saga";
import OrderCartSagas from "./order-cart-saga";
import ModSagas from "./mod-saga";
import AdminProductSagas from "./admin-product-saga";
import AdminPostSagas from "./admin-post-saga";

export default function* root() {
  yield all([
    takeLatest(LoginTypes.LOGIN_REQUEST, LoginSagas.loginUser),
    takeLatest(LoginTypes.SIGN_UP_REQUEST, LoginSagas.signUpUser),
    takeLatest(LoginTypes.FORGOT_REQUEST, LoginSagas.forgotEmail),
    takeLatest(ForgotTypes.RESET_REQUEST, ResetPassword.resetPassword),
    takeLatest(HomePageTypes.GET_INFOR_REQUEST, HomePageSagas.userInformation),
    takeLatest(EditTypes.EDIT_REQUEST, EditProfileSagas.editProfile),
    takeLatest(EditTypes.UPLOAD_REQUEST, EditProfileSagas.changeAvatar),
    takeLatest(ChangePassTypes.CHANGE_REQUEST, ChangePassSagas.changePass),
    takeLatest(
      IntroProductTypes.GET_INTRO_PRODUCT_REQUEST,
      IntroProductSagas.getIntroProduct
    ),
    takeLatest(
      IntroProductTypes.GET_RECYCLE_PRODUCT_REQUEST,
      IntroProductSagas.getRecycleProduct
    ),
    takeLatest(
      ConvensionTypes.GET_CONVENSION_REQUEST,
      PaperConvensionSagas.getConvensionRate
    ),
    takeLatest(
      ProductDetailTypes.GET_PRODUCT_DETAIL_REQUEST,
      ProductDetailSagas.getProductDetail
    ),
    takeLatest(LifeWayTypes.GET_LIFE_WAY_REQUEST, LifeWaySagas.getPostInfor),
    takeLatest(
      IntroProductTypes.UPDATE_LIKE_PRODUCT,
      IntroProductSagas.updateLikeProduct
    ),
    takeLatest(
      IntroProductTypes.SEARCH_DEFAULT,
      IntroProductSagas.searchDefault
    ),
    takeLatest(IntroProductTypes.SEARCH_HIGH, IntroProductSagas.searchHigh),
    takeLatest(LifeWayTypes.GET_LIFE_WAY_REQUEST, LifeWaySagas.getPostInfor),
    takeLatest(
      LifeWayTypes.GET_LIFE_WAY_DETAIL_REQUEST,
      LifeWaySagas.getPostDetailInfor
    ),
    takeLatest(LifeWayTypes.GET_LIFE_WAY_LIKE_REQUEST, LifeWaySagas.likePost),
    takeLatest(
      LifeWayTypes.GET_LIFE_WAY_SEARCH_REQUEST,
      LifeWaySagas.searchPost
    ),
    takeLatest(LifeWayTypes.GET_POST_LIKE_MUCH, LifeWaySagas.getPostLikeMuch),
    takeLatest(
      UserLikeProductTypes.GET_PRODUCT_LIKE_REQUEST,
      UserProductLikeSagas.getProductLikeInfor
    ),
    takeLatest(
      UserOrderHistoryTypes.GET_USER_ORDER_REQUEST,
      UserOrderHistorySagas.getOrderHistoryInfor
    ),
    takeLatest(
      UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_REQUEST,
      UserOrderHistorySagas.getOrderDetailInfor
    ),
    takeLatest(
      UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_ID_REQUEST,
      UserOrderHistorySagas.getOrderDetailIdInfor
    ),
    takeLatest(
      UserOrderHistoryTypes.GET_ORDER_DETAIL_BY_GUEST_REQUEST,
      UserOrderHistorySagas.getOrderDetailInforGuest
    ),
    takeLatest(
      IntroProductTypes.LIST_PRODUCT_SEARCH,
      IntroProductSagas.getListSearchProduct
    ),
    // takeLatest(UserLikeProductTypes.GET_PRODUCT_LIKE_REQUEST,UserProductLikeSagas.getProductLikeInfor),
    // takeLatest(UserOrderHistoryTypes.GET_USER_ORDER_REQUEST,UserOrderHistorySagas.getOrderHistoryInfor),
    // takeLatest(UserOrderHistoryTypes.GET_USER_ORDER_DETAIL_REQUEST,UserOrderHistorySagas.getOrderDetailInfor),
    // takeLatest(UserOrderHistoryTypes.GET_ORDER_DETAIL_BY_GUEST_REQUEST,UserOrderHistorySagas.getOrderDetailInforGuest),
    // takeLatest(IntroProductTypes.LIST_PRODUCT_SEARCH, IntroProductSagas.getListSearchProduct),
    takeLatest(OrderCartTypes.GET_ORDER_CART_REQUEST, OrderCartSagas.orderCart),
    takeLatest(
      OrderCartTypes.GET_INFOR_NUMBER_REQUEST,
      OrderCartSagas.getInforAbout123
    ),
    takeLatest(ModTypes.GET_USER_REQUEST, ModSagas.getUser),
    takeLatest(ModTypes.UP_ROLE_REQUEST, ModSagas.upRole),
    takeLatest(ModTypes.DOWN_ROLE_REQUEST, ModSagas.downRole),
    takeLatest(ModTypes.GET_LIST_ORDER_REQUEST, ModSagas.getOrderList),
    takeLatest(ModTypes.LOCK_REQUEST, ModSagas.lockUser),
    takeLatest(ModTypes.UNLOCK_REQUEST, ModSagas.unlockUser),
    takeLatest(ModTypes.CHANGE_STATUS_REQUEST, ModSagas.changeStatusOrder),
    //
    takeLatest(
      AdminProductTypes.GET_PRODUCT_REQUEST,
      AdminProductSagas.getAdminProductInfor
    ),
    takeLatest(
      AdminProductTypes.GET_PRODUCT_DETAIL_ADMIN_REQUEST,
      AdminProductSagas.getProductDetailInfor
    ),
    takeLatest(
      AdminProductTypes.UPDATE_PRODUCT_REQUEST,
      AdminProductSagas.updateProduct
    ),
    takeLatest(
      AdminProductTypes.DELETE_IMAGE_DETAIL_REQUEST,
      AdminProductSagas.deleteImageDetail
    ),
    takeLatest(
      AdminProductTypes.ADD_IMAGE_DETAIL_REQUEST,
      AdminProductSagas.addImageDetail
    ),
    takeLatest(
      AdminProductTypes.UPDATE_IMAGE_DETAIL_REQUEST,
      AdminProductSagas.updateImageDetail
    ),
    takeLatest(
      AdminProductTypes.ADD_NEW_PRODUCT_REQUEST,
      AdminProductSagas.addNewProduct
    ),
    takeLatest(
      AdminProductTypes.ADD_NEW_IMAGE_DETAIL_REQUEST,
      AdminProductSagas.addNewProductImage
    ),
    takeLatest(
      AdminPostTypes.GET_LIST_POST_REQUEST,
      AdminPostSagas.getListPost
    ),
    takeLatest(AdminPostTypes.ADD_NEW_POST_REQUEST, AdminPostSagas.addNewPost),
    takeLatest(
      AdminPostTypes.GET_POST_DETAIL_REQUEST,
      AdminPostSagas.getPostDetail
    ),
    takeLatest(AdminPostTypes.UPDATE_POST_REQUEST, AdminPostSagas.updatePost),
    takeLatest(
      ConvensionTypes.APPLY_NEW_RATE_REQUEST,
      PaperConvensionSagas.applyNewRate
    ),
    takeLatest(
      ConvensionTypes.GET_CONVENSION_DETAIL_REQUEST,
      PaperConvensionSagas.getConversionDetail
    ),
    takeLatest(
      ConvensionTypes.ADD_CONVENSION_REQUEST,
      PaperConvensionSagas.addNewConversion
    ),
  ]);
}
