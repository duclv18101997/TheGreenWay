import React, { Component } from "react";
import { withRouter } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../css/product-detail.css";
import { InputNumber, message, Carousel, Upload, Modal } from "antd";
import RelatedProduct from "../components/RelatedProduct";
import { connect } from "react-redux";
import ProductDetailTypes from "../redux/product-detail-redux";
import HomePageTypes from "../redux/home-page-redux";

class ProductDetail extends Component {
  state = {
    image: [],
    quantity: 0,
    backgroundPosition: "0% 0%",
    productInfor: {},
    productImage: [],
    previewVisible: false,
    previewImage: "",
    imageShow: "",
    fileList: [],
  };

  componentDidMount() {
    const productId = window.location.pathname.split("/")[2];
    this.props.getProductDetail(productId);
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    let numberOfTotal = 0;
    cart.map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
    // this.props.setDataCart(numberOfTotal);
  }
  resetQuantity = () => {
    this.setState({
      quantity: 0,
    });
  };

  getQuantity = (value, max, valueCheck) => {
    if (Number(value) !== 0) {
      if (max === 0) {
        if (valueCheck === "true") {
          message.info("Bạn đã đặt số lượng hàng tối đa!");
        } else {
          message.info("Opps. Sản phẩm đã hết hàng!");
        }
      } else {
        if (value > max) {
          message.info(`Hiện tại trong kho hàng chỉ còn ${max} sản phẩm !`);
        }
      }
    }
    if (Number(value) !== 0) {
      this.setState({
        quantity: value > max ? max : value,
      });
    } else {
      this.setState({
        quantity: 0,
      });
    }
  };

  handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    this.setState({ backgroundPosition: `${x}% ${y}%` });
  };

  addToCart = () => {
    const { quantity } = this.state;
    const { productInfor } = this.props;
    const product = {
      ProductID: productInfor.ProductID,
      ProductName: productInfor.ProductName,
      ProductPrice: productInfor.ProductPrice,
      ImageDetail: productInfor.ImageDetail,
      NumberOfLikes: productInfor.NumberOfLikes,
      Quantity: productInfor.Quantity,
      quatityBuy: quantity,
    };
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    const indexNumber = cart.findIndex(
      (element) => element.ProductID === product.ProductID
    );
    if (indexNumber >= 0) {
      if (quantity === 0) {
        if (product.Quantity === cart[indexNumber].quatityBuy + quantity) {
          message.error(
            "Opps. Xin lỗi bạn, sản phẩm này đã không đủ số hàng !"
          );
          return;
        } else {
          message.info("Opps. Hãy nhập số lượng cần mua !");
          return;
        }
      } else {
        if (product.Quantity < cart[indexNumber].quatityBuy + quantity) {
          message.error(
            "Opps. Xin lỗi bạn, sản phẩm này đã không đủ số hàng !"
          );
        } else {
          message.success("Thêm sản phẩm vào giỏ hàng thành công !");
          cart[indexNumber].quatityBuy =
            cart[indexNumber].quatityBuy + quantity;
          let numberOfTotal = 0;
          cart.map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
          this.props.setDataCart(numberOfTotal);
          localStorage.setItem("cart", JSON.stringify(cart));
          this.props.history.push("/cart");
        }
      }
    } else {
      if (quantity === 0) {
        if (product.Quantity === 0) {
          message.error(
            "Opps. Xin lỗi bạn, sản phẩm này đã không đủ số hàng !"
          );
          return;
        } else {
          message.info("Opps. Hãy nhập số lượng cần mua !");
          return;
        }
      } else {
        if (product.Quantity === 0) {
          message.error("Opps. Xin lỗi bạn, sản phẩm này đã hết hàng");
        } else {
          message.success(
            `Thêm sản phẩm vào giỏ hàng thành công ${quantity} sản phẩm !`,
            2
          );
          cart.push(product);
          let numberOfTotal = 0;
          cart.map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
          this.props.setDataCart(numberOfTotal);
          localStorage.setItem("cart", JSON.stringify(cart));
          this.props.history.push("/cart");
        }
      }
    }
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {};

  render() {
    window.scrollTo(0, 0);
    const { convensionRate, productInfor, productImages } = this.props;
    let arrayImages = [];
    if (productImages !== "No Images") {
      productImages.map((item) => {
        arrayImages.push(item.urlImage);
      });
    } else {
      arrayImages = [
        "https://firebasestorage.googleapis.com/v0/b/demoweb-2d974.appspot.com/o/images%2FCay-van-loc-hop-menh-gi-1.jpg?alt=media&token=e3e70f2c-7727-4836-8bdb-07b08e52985c",
      ];
    }
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    const cartItem =
      cart.find((element) => element.ProductID === productInfor.ProductID) ||
      {};

    const props = {
      showUploadList: {
        showDownloadIcon: false,
        showRemoveIcon: false,
      },
    };
    return (
      <div>
        <NavBar />
        <div className="product-containerr">
          <div className="product-detail">
            <div style={{ width: "448px" }}>
              <Carousel auto style={{ width: "440px", marginBottom: "20px" }}>
                {(
                  productImages || [
                    "https://firebasestorage.googleapis.com/v0/b/demoweb-2d974.appspot.com/o/images%2FCay-van-loc-hop-menh-gi-1.jpg?alt=media&token=e3e70f2c-7727-4836-8bdb-07b08e52985c",
                  ]
                ).map((item, index) => {
                  return (
                    <div key={index}>
                      <img
                        style={{ width: "100%", height: "450px" }}
                        src={item.urlImage}
                      />
                    </div>
                  );
                })}
              </Carousel>
              <div className="clearfix">
                <Upload
                  {...props}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={(arrayImages || []).map((ele, index) => ({
                    uid: index,
                    name: "a",
                    status: "done",
                    url: ele,
                  }))}
                  onPreview={(ele) => {
                    this.setState({
                      previewVisible: true,
                      imageShow: ele.url,
                    });
                  }}
                ></Upload>

                <Modal
                  visible={this.state.previewVisible}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={this.state.imageShow}
                  />
                </Modal>
              </div>
            </div>

            <div className="product-infor">
              <p className="product-name">{productInfor.ProductName}</p>
              <div className="item-detail-price">
                <div className="item-detail-coin">
                  <img src={require("../images/svgIcon/money.svg")} alt="" />
                  <span>
                    {productInfor.ProductPrice
                      ? productInfor.ProductPrice.replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          "$1,"
                        )
                      : 0}{" "}
                    VNĐ
                  </span>
                </div>
                <div className="item-detail-coin" style={{ marginTop: "10px" }}>
                  <img src={require("../images/svgIcon/paper.svg")} alt="" />
                  <span>
                    {/* {Math.floor(productInfor.ProductPrice / convensionRate)} Kg */}
                    {Number(
                      (productInfor.ProductPrice / convensionRate).toFixed(1)
                    )}{" "}
                    Kg
                  </span>
                </div>
              </div>
              <div className="item-quantity" style={{ marginTop: "10px" }}>
                <span className="mr-4">Số lượng:</span>
                <InputNumber
                  type="number"
                  min={0}
                  // max={}
                  value={this.state.quantity}
                  onChange={(value) =>
                    this.getQuantity(
                      value,
                      (productInfor.Quantity || 0) - (cartItem.quatityBuy || 0),
                      cartItem.quatityBuy ? "true" : "false"
                    )
                  }
                />
              </div>
              <div className="item-short-decription mt-5">
                <span
                  className="item-short-decription-span"
                  dangerouslySetInnerHTML={{ __html: productInfor.Description }}
                />
                <a href="#description" className="text-see-more mb-5">
                  ...Xem thêm
                </a>
              </div>
              <div className="add-to-cart mt-2">
                <div onClick={this.addToCart}>
                  <img
                    style={{
                      height: "32px",
                      width: "32px",
                      marginRight: "10px",
                    }}
                    src={require("../images/svgIcon/cart.svg")}
                    alt=""
                  />
                  <span>Thêm vào giỏ hàng</span>
                </div>
              </div>
            </div>
          </div>
          <div className="product-detail-bottom" id="description">
            <div className="product-detail-description">
              <span style={{ fontSize: "28px", fontWeight: "bold" }}>
                Mô tả sản phẩm
              </span>
              <div
                dangerouslySetInnerHTML={{ __html: productInfor.Description }}
              />
            </div>
            <div style={{ height: "auto", width: "100%" }}>
              <div>
                <span style={{ fontSize: "28px", fontWeight: "bold" }}>
                  Xem thêm sản phẩm
                </span>
              </div>
              <RelatedProduct
                idP={window.location.pathname.split("/")[2]}
                category={productInfor.CategoryID}
                onClickTop={this.onClickTop}
                resetData={this.resetQuantity}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productInfor: state.productDetail.productInfor,
    productImages: state.productDetail.productImages,
    convensionRate: state.convension.convensionRate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductDetail: (productId) => {
      dispatch(ProductDetailTypes.getProductDetailRequest(productId));
    },
    setDataCart: (param) => {
      dispatch(HomePageTypes.updateStateCart(param));
    },
  };
};

ProductDetail = withRouter(ProductDetail);
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
