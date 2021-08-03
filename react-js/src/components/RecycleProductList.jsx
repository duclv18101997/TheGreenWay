import React, { Component } from "react";
import "../css/product-list.css";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { message } from "antd";
import IntroProductTypes from "../redux/get-intro-product-redux";
import ConvensionTypes from "../redux/paper-conversion-redux";
import HomePageTypes from "../redux/home-page-redux";

class RecycleProductList extends Component {
  state = {
    convensionRate: 0,
  };

  componentDidMount() {
    this.props.getPaperConvension();
    const params = {
      idCategory: 2,
      page: 1,
    };
    this.props.getRecycleProduct(params);
  }

  handleClick = (event, item) => {
    this.props.history.push(`/product-detail/${item.ProductID}`);
  };

  changeHeart = (event, item) => {
    event.stopPropagation();
    const token = window.localStorage.getItem("x-access-token");
    if (!token) {
      message.error("Vui lòng đăng nhập để thích sản phẩm", 2);
    } else {
      this.props.setDataLike({
        method: item.like === "like" ? "unLike" : "like",
        idP: item.ProductID,
      });
    }
  };

  addToShoppingCart = (event, item) => {
    event.stopPropagation();
    const product = {
      ...item,
      quatityBuy: 1,
    };
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    const indexNumber = cart.findIndex(
      (element) => element.ProductID === product.ProductID
    );
    if (indexNumber >= 0) {
      if (product.Quantity < cart[indexNumber].quatityBuy + 1) {
        message.error("Opps. Bạn đã đặt tối đa số sản phẩm này!");
      } else {
        message.success("Thêm sản phẩm vào giỏ hàng thành công !");
        cart[indexNumber].quatityBuy = cart[indexNumber].quatityBuy + 1;
      }
    } else {
      if (product.Quantity === 0) {
        message.error("Opps. Xin lỗi bạn, sản phẩm này đã hết hàng");
      } else {
        message.success("Thêm sản phẩm vào giỏ hàng thành công !");
        cart.push(product);
      }
    }

    let numberOfTotal = 0;
    cart.map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
    this.props.setDataCart(numberOfTotal);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  render() {
    const { convensionRate, recycleProduct } = this.props;
    return (
      <div className="product-list-wrapper">
        <div className="product-container">
          {recycleProduct.map((item, index) => {
            return (
              <div
                className="sub-item shadow bg-white rounded"
                onClick={(event) => this.handleClick(event, item)}
                key={index}
              >
                <div className="hovereffect">
                  {item.Quantity === 0 ? (
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        position: "absolute",
                        zIndex: "1000",
                        margin: "10px 0 0 10px",
                        background: "#f0524b",
                        borderRadius: "50%",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#fff",
                        }}
                      >
                        Hết hàng
                      </p>
                    </div>
                  ) : null}
                  <img src={item.ImageDetail} alt="" />
                  <div className="overlayy">
                    <a
                      className="info"
                      onClick={(event) => this.addToShoppingCart(event, item)}
                    >
                      <div style={{ display: "flex" }}>
                        <img
                          style={{
                            height: "32px",
                            width: "32px",
                            marginRight: "10px",
                          }}
                          src={require("../images/svgIcon/cart.svg")}
                          alt=""
                        />
                        <span className="textAddToCart">Thêm vào giỏ hàng</span>
                      </div>
                    </a>
                    <div className="heart-icon">
                      {(item || {}).like === "like" ? (
                        <img
                          onClick={(event) => this.changeHeart(event, item)}
                          style={{ height: "35px", width: "35px" }}
                          src={require("../images/svgIcon/like.svg")}
                          alt=""
                        />
                      ) : (
                        <img
                          onClick={(event) => this.changeHeart(event, item)}
                          style={{ height: "35px", width: "35px" }}
                          src={require("../images/svgIcon/unLike.svg")}
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "300px",
                    fontSize: "25px",
                    fontStyle: "normal",
                    fontWeight: "normal",
                  }}
                >
                  <span onClick={(event) => this.handleClick(event, item)}>
                    {item.ProductName}
                  </span>
                </div>
                <div className="item-infor">
                  <div className="item-price">
                    <div className="item-coin">
                      <img
                        src={require("../images/svgIcon/money.svg")}
                        alt=""
                      />
                      <span>
                        {item.ProductPrice
                          ? item.ProductPrice.replace(
                              /(\d)(?=(\d{3})+(?!\d))/g,
                              "$1,"
                            )
                          : 0}{" "}
                        VNĐ
                      </span>
                    </div>
                    <div className="item-coin" style={{ marginTop: "5px" }}>
                      <img
                        src={require("../images/svgIcon/paper.svg")}
                        alt=""
                      />
                      <span>
                        {Number(
                          (item.ProductPrice / convensionRate).toFixed(1)
                        )}{" "}
                        Kg
                      </span>
                    </div>
                  </div>
                  <div className="item-like">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: " center",
                        height: " 100%",
                      }}
                    >
                      <img
                        style={{ height: "32px" }}
                        src={require("../images/svgIcon/nLike.svg")}
                        alt=""
                      />
                      <span className="textLike">{item.NumberOfLikes}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recycleProduct: state.introProduct.recycleProduct,
    convensionRate: state.convension.convensionRate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaperConvension: () => {
      dispatch(ConvensionTypes.getConvensionRequest());
    },
    getRecycleProduct: (params) => {
      dispatch(IntroProductTypes.getRecycleProductRequest(params));
    },
    setDataLike: (params) => {
      dispatch(IntroProductTypes.updateLikeProduct(params));
    },
    setDataCart: (params) => {
      dispatch(HomePageTypes.updateStateCart(params));
    },
  };
};

RecycleProductList = withRouter(RecycleProductList);
export default connect(mapStateToProps, mapDispatchToProps)(RecycleProductList);
