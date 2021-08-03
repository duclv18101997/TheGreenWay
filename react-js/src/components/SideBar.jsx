import React, { Component } from "react";
import { Layout, Menu, message, Spin, Icon } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { storage } from "../firebase";
import HomePageTypes from "../redux/home-page-redux";
import EditTypes from "../redux/edit-profile";
import ChangePassTypes from "../redux/change-password-redux";

const { Sider } = Layout;

class SideBar extends Component {
  state = {
    email: "",
    visibleAccountInfor: false,
    userName: "abcxyz",
    password: "",
    newPassword: "",
    confirmPassword: "",
    phone: "",
    DOB: null,
    address: "",
    city: "",
    country: "",
    avartarUrl: "",
    dataTest: "",
    image: null,
    url: "",
    roles: "",
    progress: 0,
    progressClass: "ml-2 progress-bar",
    visiblePassModal: false,
    loading: false,
    stateLoading: false,
  };

  componentDidMount() {
    this.props.getUserInfor();
  }

  componentDidUpdate(nextProps) {
    if (
      this.props.userInformation &&
      nextProps.userInformation !== this.props.userInformation
    ) {
      this.setState({
        userName: this.props.userInformation.username,
        address: this.props.userInformation.address,
        city: this.props.userInformation.city,
        country: this.props.userInformation.country,
        password: this.props.userInformation.password,
        avartarUrl: this.props.userInformation.urlAvatar,
        email: this.props.userInformation.email,
        roles: this.props.userInformation.roles,
        DOB: this.props.userInformation.DOB,
        phone: this.props.userInformation.phone,
      });
      if (this.state.DOB) {
        this.setState({
          DOB: this.state.DOB.slice(0, 10),
        });
      }
    }
    if (
      this.props.notifyPasswordMessage === "Change Password Of User Is Success!"
    ) {
      this.props.updateNotify();
      this.setState({
        visiblePassModal: false,
      });
      window.location.href = "/account";
    }
  }

  handleLogOut = () => {
    window.localStorage.removeItem("token");
    this.props.history.push("/");
  };

  clickImage(e) {
    document.querySelector("#profileImage").click();
  }

  changeImage = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      const isJpgOrPng =
        image.type === "image/jpeg" || image.type === "image/png";
      if (isJpgOrPng) {
        const isLt2M = image.size / 1024 / 1024 < 3;
        if (!isLt2M) {
          message.error("Ảnh phái có kích thước nhỏ hơn 3MB!");
        } else {
          this.setState({
            stateLoading: true,
          });
          const reader = new FileReader();
          reader.onload = function (e) {
            document
              .querySelector("#profileDisplay")
              .setAttribute("src", e.target.result);
          };
          reader.readAsDataURL(e.target.files[0]);
          const uploadTask = storage.ref(`images/${image.name}`).put(image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {},
            () => {
              storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                  this.setState({ url });
                  this.setState({
                    stateLoading: false,
                  });
                  // if (this.state.url) {
                  this.props.changeAvatar({
                    urlAvatar: url,
                  });
                });
            }
          );
        }
      } else {
        message.error("File upload phải có định dạng .jpg hoặc .png");
      }
    }
  };

  render() {
    const antIcon = (
      <Icon type="loading-3-quarters" style={{ fontSize: 90 }} spin />
    );
    const { stateLoading } = this.state;
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
        style={{ position: "fixed" }}
      >
        <div className="sideBar-container">
          <div className="logo" />
          <div style={{ position: "relative", marginTop: "30px" }}>
            {stateLoading ? (
              <div
                style={{
                  zIndex: "200",
                  background: "#d9d9d98f",
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                }}
              >
                <Spin indicator={antIcon} />
              </div>
            ) : null}

            <span className="img-div">
              <div
                className="text-center img-placeholder"
                onClick={this.clickImage}
              >
                <p style={{ paddingTop: "85px" }}>
                  Ấn vào để thay đổi ảnh đại diện của bạn
                </p>
              </div>
              <img
                src={this.state.url || this.state.avartarUrl}
                onClick={this.clickImage}
                id="profileDisplay"
              />
            </span>
            <input
              type="file"
              name="profileImage"
              onChange={this.changeImage}
              id="profileImage"
              className="form-control"
              style={{ display: "none" }}
            />
          </div>
          <div className="user-information">
            <p>{this.state.userName}</p>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[
              `/${this.props.location.pathname.split("/")[1]}`,
            ]}
          >
            <Menu.Item
              key="/account"
              onClick={() => {
                this.props.history.push("/account");
              }}
            >
              <img
                src={require("../images/svgIcon/user.svg")}
                alt="aaa"
                style={{ height: "32px", width: "32px" }}
              />
              <span>Thông tin tài khoản</span>
            </Menu.Item>
            <Menu.Item
              key="/changepassword"
              onClick={() => {
                this.props.history.push("/changepassword");
              }}
            >
              <img
                src={require("../images/svgIcon/password.svg")}
                alt="aaa"
                style={{ height: "32px", width: "32px" }}
              />
              <span>Thay đổi mật khẩu</span>
            </Menu.Item>
            <Menu.Item
              key="/changepassword1"
              onClick={() => {
                this.props.history.push("/user-order-history");
              }}
            >
              <img
                src={require("../images/svgIcon/shopping-history.svg")}
                alt="aaa"
                style={{ height: "32px", width: "32px" }}
              />
              <span>Lịch sử mua hàng</span>
            </Menu.Item>
            <Menu.Item
              key="/changepassword2"
              onClick={() => {
                this.props.history.push("/user-product-like");
              }}
            >
              <img
                src={require("../images/svgIcon/heart.svg")}
                alt="aaa"
                style={{ height: "32px", width: "32px" }}
              />
              <span>Sản phẩm đã thích</span>
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
    );
  }
}

const mapStateToProps = (state) => ({
  collapsed: state.sideBar.collapsed,
  userInformation: state.homePage.userInformation,
  notifyMessage: state.editProfile.notifyMessage,
  notifyPasswordMessage: state.changePass.notifyMessage,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfor: () => {
      dispatch(HomePageTypes.getInforRequest());
    },
    editUserProfile: (data) => {
      dispatch(EditTypes.editRequest(data));
    },
    changePass: (data) => {
      dispatch(ChangePassTypes.changeRequest(data));
    },
    changeAvatar: (data) => {
      dispatch(EditTypes.uploadRequest(data));
    },
    updateNotify: () => {
      dispatch(EditTypes.updateNotify());
    },
  };
};
SideBar = withRouter(SideBar);

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
