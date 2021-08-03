import React, { Component } from "react";
import { message, Pagination } from "antd";
import "../css/product-list.css";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import IntroProductTypes from "../redux/get-intro-product-redux";
import ConvensionTypes from "../redux/paper-conversion-redux";
import HomePageTypes from "../redux/home-page-redux";
import SearchComponent from "./Seaarch";

class RecycleProductDetailList extends Component {
  state = {
    introData: [],
    current: 1,
    checkSearch: false,
    valueSearch: "",
    valueSearchHigh: {},
  };

  componentDidMount() {
    this.props.getPaperConvension();
    const params = {
      idCategory: 2,
      page: 1,
    };
    this.props.getIntroProduct(params);
    this.props.getDataSearch({ idCategory: 2 });
  }

  onSelectPageChange = (page) => {
    window.scrollTo(500, 500);
    const { checkSearch, valueSearch, valueSearchHigh } = this.state;
    if (checkSearch) {
      if (valueSearchHigh) {
        this.setState({
          current: page,
        });
        this.setState({
          checkSearch: true,
        });
        this.props.searchHigh({
          value: valueSearchHigh,
          page: page,
          cate: "2",
        });
      }
      if (valueSearch) {
        this.setState({
          current: page,
        });
        this.setState({
          checkSearch: true,
        });
        this.props.searchDefault({
          value: valueSearch,
          page: page,
          cate: "2",
        });
      }
    } else {
      this.setState({
        current: page,
      });
      const params = {
        idCategory: 2,
        page: page,
      };
      this.props.getIntroProduct(params);
    }
  };

  handleClick = (event, id) => {
    event.stopPropagation();
    this.props.history.push(`/product-detail/${id}`);
  };

  onChangeCheckSearch = (value) => {
    this.setState({
      checkSearch: value,
    });
  };

  onSearchHigh = (value) => {
    this.setState({
      valueSearchHigh: value,
      valueSearch: null,
    });
    this.setState({
      current: 1,
    });
    if (value.textName === "" && value.maxP === "" && value.minP === "") {
      this.setState({
        checkSearch: false,
      });
      const params = {
        idCategory: 2,
        page: 1,
      };
      this.props.getIntroProduct(params);
    } else {
      this.setState({
        checkSearch: true,
      });
      this.props.searchHigh({
        value: value,
        page: 1,
        cate: "2",
      });
    }
  };

  onSearchFullText = (value) => {
    this.setState({
      valueSearch: value,
      valueSearchHigh: null,
    });
    this.setState({
      current: 1,
    });
    if (value) {
      this.setState({
        checkSearch: true,
      });
      this.props.searchDefault({
        value: value,
        page: 1,
        cate: "2",
      });
    } else {
      this.setState({
        checkSearch: false,
      });
      const params = {
        idCategory: 2,
        page: 1,
      };
      this.props.getIntroProduct(params);
    }
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
    const { convensionRate, introProduct } = this.props;
    const { checkSearch } = this.state;
    return (
      <div className="product-list-wrapper" style={{ marginTop: "10px" }}>
        <SearchComponent
          onSearchFullText={this.onSearchFullText}
          onSearchHigh={this.onSearchHigh}
        />
        {this.props.resultSize && checkSearch ? (
          <div style={{ marginTop: "5px" }}>
            <span>Có {this.props.resultSize} sản phẩm được tìm kiếm</span>
          </div>
        ) : null}
        <div className="product-container">
          {introProduct.map((item, index) => {
            return (
              <div
                className="sub-item shadow bg-white rounded"
                onClick={(event) => this.handleClick(event, item.ProductID)}
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
                  <span>{item.ProductName}</span>
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
        {introProduct.length !== 0 ? (
          <Pagination
            current={this.state.current}
            onChange={this.onSelectPageChange}
            total={this.props.totalPage * 10}
          />
        ) : null}
        {introProduct.length === 0 ? (
          <span>Không có sản phầm nào !</span>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    resultSize: state.introProduct.resultsize,
    introProduct: state.introProduct.recycleProduct,
    totalPage: state.introProduct.totalRecyclePage,
    convensionRate: state.convension.convensionRate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaperConvension: () => {
      dispatch(ConvensionTypes.getConvensionRequest());
    },
    getIntroProduct: (params) => {
      dispatch(IntroProductTypes.getRecycleProductRequest(params));
    },
    setDataCart: (params) => {
      dispatch(HomePageTypes.updateStateCart(params));
    },
    setDataLike: (params) => {
      dispatch(IntroProductTypes.updateLikeProduct(params));
    },
    searchDefault: (params) => {
      dispatch(IntroProductTypes.searchDefault(params));
    },
    searchHigh: (params) => {
      dispatch(IntroProductTypes.searchHigh(params));
    },
    resetData: (params) => {
      dispatch(IntroProductTypes.resetData());
    },
    getDataSearch: (params) => {
      dispatch(IntroProductTypes.listProductSearch(params));
    },
  };
};

RecycleProductDetailList = withRouter(RecycleProductDetailList);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecycleProductDetailList);
