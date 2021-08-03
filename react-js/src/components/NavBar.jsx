import React, { Component } from "react";
import { Icon, Dropdown, Menu, Modal, Button, Badge, message } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import HomePageTypes from "../redux/home-page-redux";
import LifeWayTypes from "../redux/life-way-redux";
import axios from "axios";
import { resolveOnChange } from "antd/lib/input/Input";
class NavBar extends Component {
  state = {
    userName: "",
    urlAvatar: "",
    visibleLogout: false,
  };

  componentDidMount() {
    const token = window.localStorage.getItem("x-access-token");
    if (token) {
      this.props.getUserInfor();
    }
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    let numberOfTotal = 0;
    cart.map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
    this.props.setDataCart(numberOfTotal);
  }

  toLogin = () => {
    this.props.history.push("/login");
  };

  handleLogoutCancel = (e) => {
    this.setState({
      visibleLogout: false,
    });
  };

  handleLogoutOk = (e) => {
    window.localStorage.clear();
    window.location.href = "/";
  };

  showLogoutModal = () => {
    this.setState({
      visibleLogout: true,
    });
  };

  toAdminPage = () => {
    this.props.history.push("/admin?page=user-infor");
  };

  showModalAccount = () => {
    this.props.history.push("/account");
  };

  toHomePage = () => {
    this.props.history.push("/");
  };

  toContactPage = () => {
    this.props.history.push("/about-us");
  };

  toProductPage = () => {
    this.props.history.push("/product");
  };

  toLifeWay = async () => {
    window.scrollTo(0, 0);
    const params = {
      page: 1,
    };
    await this.props.getPostInfor(params);
    await this.props.getPostLikeMuch();
    await this.props.setCheckSearchFalse();
    await this.props.history.push("/life-way");
  };

  toCart = () => {
    this.props.history.push("/cart");
  };

  checkToken = async () => {
    const check = await axios.get(
      "http://localhost:3001/user/checkstatususer",
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.localStorage.getItem("x-access-token"),
        },
      }
    );
    if (check.data.success === false) {
      throw new Error("Tài khoản bị khoá");
    } else {
      return true;
    }
  };

  render() {
    var token = window.localStorage.getItem("x-access-token");
    var roles = window.localStorage.getItem("roles");
    if (token) {
      this.checkToken().then(
        () => {},
        (e) => {
          if (e.message === "Tài khoản bị khoá") {
            window.localStorage.clear();
            this.props.history.push("/lock-account");
          }
          // message.error("Token không chính xác hoặc đã hết hạn sử dụng!", 3);
          if (e.message === "Request failed with status code 401") {
            // console.log("123");
            this.props.history.push("/token-false");
          }
        }
      );
    }
    const { userInformation } = this.props;
    //menu dropdown
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a onClick={this.showModalAccount}>Thông tin tài khoản</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a onClick={this.showLogoutModal}>Đăng xuất</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <nav
          className="navbar navbar-expand-lg navbar-dark fixed-top"
          id="mainNav"
        >
          <div className="container navbar-container">
            <div onClick={this.toHomePage} className="nav-logo-container">
              <img
                style={{ width: "175px", height: "58px", cursor: "pointer" }}
                src={require("../images/logo-1.png")}
                alt=""
              />
            </div>
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              Menu
              <i className="fa fa-bars"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav text-uppercase ml-auto">
                <li className="nav-item">
                  <a
                    className="nav-link js-scroll-trigger"
                    onClick={this.toProductPage}
                  >
                    Sản Phẩm
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link js-scroll-trigger"
                    onClick={this.toLifeWay}
                  >
                    Cách sống
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link js-scroll-trigger"
                    onClick={this.toContactPage}
                  >
                    Liên hệ
                  </a>
                </li>
                {token ? (
                  <div className="header-left">
                    <li className="nav-item user-name">
                      <img
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                        src={userInformation.urlAvatar}
                        // alt=""
                      />
                      <Dropdown
                        style={{ width: "500px" }}
                        overlay={menu}
                        trigger={["click"]}
                      >
                        <a
                          style={{
                            color: "#000 !important",
                            fontSize: "16px",
                            marginLeft: "10px",
                          }}
                          className="ant-dropdown-link"
                          href="#"
                        >
                          {userInformation.username} <Icon type="down" />
                        </a>
                      </Dropdown>
                    </li>
                  </div>
                ) : (
                  <li className="nav-item">
                    <a
                      className="nav-link js-scroll-trigger"
                      onClick={this.toLogin}
                    >
                      Đăng nhập/Đăng ký
                    </a>
                  </li>
                )}
                <li className="shopping-cart-item">
                  <Badge
                    count={this.props.stateCartNumber}
                    style={{ marginRight: "8px", marginTop: "4px" }}
                  >
                    <img
                      style={{
                        height: "32px",
                        width: "32px",
                        marginRight: "10px",
                      }}
                      src={require("../images/svgIcon/sales.svg")}
                      alt=""
                      onClick={this.toCart}
                    />
                  </Badge>
                </li>
                {roles === "admin" || (roles === "mod" && token) ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Button type="primary" onClick={this.toAdminPage}>
                      Trang Admin >
                    </Button>
                  </div>
                ) : (
                  <div></div>
                )}
              </ul>
            </div>
            <Modal
              visible={this.state.visibleLogout}
              onOk={this.handleLogoutOk}
              onCancel={this.handleLogoutCancel}
              okText="Xác nhận"
              cancelText="Hủy bỏ"
            >
              <p>Bạn có thực sự muốn đăng xuất không?</p>
            </Modal>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInformation: state.homePage.userInformation,
    stateCartNumber: state.homePage.stateCartNumber,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfor: () => {
      dispatch(HomePageTypes.getInforRequest());
    },
    setDataCart: (param) => {
      dispatch(HomePageTypes.updateStateCart(param));
    },
    getPostInfor: (params) => {
      dispatch(LifeWayTypes.getLifeWayRequest(params));
    },
    getPostLikeMuch: () => {
      dispatch(LifeWayTypes.getPostLikeMuch());
    },
    setCheckSearchFalse: () => {
      dispatch(LifeWayTypes.setCheckSearchFalse());
    },
  };
};

NavBar = withRouter(NavBar);
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
