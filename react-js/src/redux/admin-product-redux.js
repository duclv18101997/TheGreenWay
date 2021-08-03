import { createReducer, createActions } from "reduxsauce";
import ColumnGroup from "antd/lib/table/ColumnGroup";

// TODO:Declare Action and type
const { Types, Creators } = createActions({
  //get list product
  getProductRequest: ["data"],
  getProductRequestFailed: ["error"],
  getProductSucceed: ["data"],

  //get product detail
  getProductDetailAdminRequest: ["data"],
  getProductDetailAdminRequestFailed: ["error"],
  getProductDetailAdminSucceed: ["data"],

  //update product infor
  updateProductRequest: ["data"],
  updateProductRequestFailed: ["error"],
  updateProductSucceed: ["data"],

  //change avatar image of product
  changeAvatarImage: ["data"],

  //add new image detail of product
  addImageDetailRequest: ["data"],
  addImageDetailRequestFailed: ["data"],
  addImageDetailSucceed: ["data"],

  //delete image detail of product
  deleteImageDetailRequest: ["data"],
  deleteImageDetailRequestFailed: ["data"],
  deleteImageDetailSucceed: ["data"],

  //add new product
  addNewProductRequest: ["data"],
  addNewProductRequestFailed: ["error"],
  addNewProductSucceed: ["data"],

  //add new product image detail
  addNewImageDetailRequest: ["data"],
  addNewImageDetailRequestFailed: ["error"],
  addNewImageDetailSucceed: ["data"],

  //remove image local
  removeImageLocalRequest: ["data"],

  //upload new image detail of product
  updateImageDetailRequest: ["data"],
  updateImageDetailRequestFailed: ["error"],
  updateImageDetailSucceed: ["data"],
});

export const AdminProductTypes = Types;
export default Creators;

//TODO: Declare initial state
export const INITIAL_STATE = {
  productList: [],
  productDetail: "",
  imageDetail: [],
  idNewProduct: "",
};

export const request = (state) => {
  return {
    ...state,
  };
};

export const getProductSucceed = (state, { data }) => {
  return {
    ...state,
    productList: data.data,
  };
};

export const getProductDetailSucceed = (state, { data }) => {
  return {
    ...state,
    productDetail: data.data,
    imageDetail: data.images === "No Images" ? [] : data.images,
  };
};

export const updateProductSucceed = (state, { data }) => {
  return {
    ...state,
    productList: state.productList.map((el) => {
      if (el.ProductID === data.params.idProduct) {
        return {
          ...el,
          ProductName: data.params.ProductName,
          ProductPrice: data.params.ProductPrice,
          ImageDetail: data.params.ImageDetail,
          Quantity: data.params.Quantity,
          CategoryID: data.params.CategoryID,
        };
      }
      return el;
    }),
  };
};

export const addImageSucceed = (state, { data }) => {
  return {
    ...state,
    imageDetail: [
      ...state.imageDetail,
      {
        ImageID: data.data.idImage.MAX,
        urlImage: data.urlImage,
      },
    ],
  };
};

export const deleteImageSucceed = (state, { data }) => {
  return {
    ...state,
    imageDetail: state.imageDetail.filter((el) => el.ImageID !== data),
  };
};

export const addNewProductSucceed = (state, { data }) => {
  return {
    ...state,
    idNewProduct: data.idProduct,
  };
};

export const addNewProductImageDetailSucceed = (state, { data }) => {
  return {
    ...state,
  };
};

export const changeAvatarImage = (state, { data }) => {
  return {
    ...state,
    productDetail: {
      ...state.productDetail,
      ImageDetail: data,
    },
  };
};

export const failed = (state, { error }) => {
  return {
    ...state,
  };
};

export const updateImageSucceed = (state, data) => {
  return {
    ...state,
    imageDetail: [
      ...state.imageDetail,
      {
        ImageID: data.data.idImage,
        urlImage: data.data.urlImage,
      },
    ],
  };
};

export const removeImageLocalRequest = (state, value) => {
  // console.log("day ne", value.data);
  return {
    ...state,
    imageDetail: state.imageDetail.filter((el) => el.ImageID !== value.data),
  };
};

//TODO:Hookup Reducers To Types in Action
export const reducer = createReducer(INITIAL_STATE, {
  [AdminProductTypes.GET_PRODUCT_REQUEST]: request,
  [AdminProductTypes.GET_PRODUCT_SUCCEED]: getProductSucceed,
  [AdminProductTypes.GET_PRODUCT_REQUEST_FAILED]: failed,
  [AdminProductTypes.GET_PRODUCT_DETAIL_ADMIN_REQUEST]: request,
  [AdminProductTypes.GET_PRODUCT_DETAIL_ADMIN_SUCCEED]: getProductDetailSucceed,
  [AdminProductTypes.GET_PRODUCT_DETAIL_ADMIN_REQUEST_FAILED]: failed,
  [AdminProductTypes.UPDATE_PRODUCT_REQUEST]: request,
  [AdminProductTypes.UPDATE_PRODUCT_SUCCEED]: updateProductSucceed,
  [AdminProductTypes.UPDATE_PRODUCT_REQUEST_FAILED]: failed,
  [AdminProductTypes.CHANGE_AVATAR_IMAGE]: changeAvatarImage,
  [AdminProductTypes.ADD_IMAGE_DETAIL_REQUEST]: request,
  [AdminProductTypes.ADD_IMAGE_DETAIL_SUCCEED]: addImageSucceed,
  [AdminProductTypes.ADD_IMAGE_DETAIL_REQUEST_FAILED]: failed,
  [AdminProductTypes.UPDATE_IMAGE_DETAIL_REQUEST]: request,
  [AdminProductTypes.UPDATE_IMAGE_DETAIL_SUCCEED]: updateImageSucceed,
  [AdminProductTypes.UPDATE_IMAGE_DETAIL_REQUEST_FAILED]: failed,
  [AdminProductTypes.DELETE_IMAGE_DETAIL_REQUEST]: request,
  [AdminProductTypes.DELETE_IMAGE_DETAIL_SUCCEED]: deleteImageSucceed,
  [AdminProductTypes.DELETE_IMAGE_DETAIL_REQUEST_FAILED]: failed,
  [AdminProductTypes.ADD_NEW_PRODUCT_REQUEST]: request,
  [AdminProductTypes.ADD_NEW_PRODUCT_SUCCEED]: addNewProductSucceed,
  [AdminProductTypes.ADD_NEW_PRODUCT_REQUEST_FAILED]: failed,
  [AdminProductTypes.ADD_NEW_IMAGE_DETAIL_REQUEST]: request,
  [AdminProductTypes.ADD_NEW_IMAGE_DETAIL_SUCCEED]: addNewProductImageDetailSucceed,
  [AdminProductTypes.ADD_NEW_IMAGE_DETAIL_REQUEST_FAILED]: failed,
  [AdminProductTypes.REMOVE_IMAGE_LOCAL_REQUEST]: removeImageLocalRequest,
});
