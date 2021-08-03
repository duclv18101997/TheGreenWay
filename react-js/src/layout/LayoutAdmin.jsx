import React, { Component } from "react";
import { Menu, Icon } from "antd";
import "../css/layout-admin.css";
import { withRouter } from "react-router";
import NavBar from "../components/NavBar";
import UserInforList from "../pages/admin/UserInforList/UserInforList";
import ProductInforList from "../pages/admin/ProductInforList";
import CreateProduct from "../pages/admin/CreateProduct";
import PostInforList from "../pages/admin/PostInforList";
import CreatePost from "../pages/admin/CreatePost";
import CartInforList from "../pages/admin/CartInforList";
import ConversionPaper from "../pages/admin/ConversionPaper";
import queryString from "query-string";
import { Redirect } from "react-router-dom";
const { SubMenu } = Menu;
class LayoutAdmin extends Component {
  state = {
    collapsed: false,
    selectedKey: "",
    showUserInfor: false,
    showProductInfor: false,
    showPostInfor: false,
    showCartInfor: false,
    showCreateProduct: false,
    showCreatePost: false,
    showConversionPaper: false,
  };

  componentDidMount() {
    const page = queryString.parse(this.props.history.location.search).page;
    if (page === "user-infor") {
      this.setState({
        selectedKey: "userInfor",
        showUserInfor: true,
        showProductInfor: false,
        showPostInfor: false,
        showCartInfor: false,
        showCreateProduct: false,
        showCreatePost: false,
        showConversionPaper: false,
      });
    } else if (page === "product-infor") {
      this.setState({
        selectedKey: "inforProduct",
        showUserInfor: false,
        showProductInfor: true,
        showPostInfor: false,
        showCartInfor: false,
        showCreateProduct: false,
        showCreatePost: false,
        showConversionPaper: false,
      });
    } else if (page === "post-infor") {
      this.setState({
        selectedKey: "postInfor",
        showUserInfor: false,
        showProductInfor: false,
        showPostInfor: true,
        showCartInfor: false,
        showCreateProduct: false,
        showCreatePost: false,
        showConversionPaper: false,
      });
    } else if (page === "cart-infor") {
      this.setState({
        selectedKey: "cartInfor",
        showUserInfor: false,
        showProductInfor: false,
        showPostInfor: false,
        showCartInfor: true,
        showCreateProduct: false,
        showCreatePost: false,
        showConversionPaper: false,
      });
    } else if (page === "create-product") {
      this.setState({
        selectedKey: "createProduct",
        showUserInfor: false,
        showProductInfor: false,
        showPostInfor: false,
        showCartInfor: false,
        showCreateProduct: true,
        showCreatePost: false,
        showConversionPaper: false,
      });
    } else if (page === "create-post") {
      this.setState({
        selectedKey: "createPost",
        showUserInfor: false,
        showProductInfor: false,
        showPostInfor: false,
        showCartInfor: false,
        showCreateProduct: false,
        showCreatePost: true,
        showConversionPaper: false,
      });
    } else if (page === "conversion-paper") {
      this.setState({
        selectedKey: "conversionPaper",
        showUserInfor: false,
        showProductInfor: false,
        showPostInfor: false,
        showCartInfor: false,
        showCreateProduct: false,
        showCreatePost: false,
        showConversionPaper: true,
      });
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  toUserInfor = () => {
    this.setState({
      selectedKey: "userInfor",
      showUserInfor: true,
      showProductInfor: false,
      showPostInfor: false,
      showCartInfor: false,
      showCreateProduct: false,
      showCreatePost: false,
      showConversionPaper: false,
    });
    this.props.history.push("/admin?page=user-infor");
  };

  toProductInfor = () => {
    this.setState({
      selectedKey: "inforProduct",
      showUserInfor: false,
      showProductInfor: true,
      showPostInfor: false,
      showCartInfor: false,
      showCreateProduct: false,
      showCreatePost: false,
      showConversionPaper: false,
    });
    this.props.history.push("/admin?page=product-infor");
  };

  toCreateInfor = () => {
    this.setState({
      selectedKey: "createProduct",
      showUserInfor: false,
      showProductInfor: false,
      showPostInfor: false,
      showCartInfor: false,
      showCreateProduct: true,
      showCreatePost: false,
      showConversionPaper: false,
    });
    this.props.history.push("/admin?page=create-product");
  };

  toPostInfor = () => {
    this.setState({
      selectedKey: "postInfor",
      showUserInfor: false,
      showProductInfor: false,
      showPostInfor: true,
      showCartInfor: false,
      showCreateProduct: false,
      showCreatePost: false,
      showConversionPaper: false,
    });
    this.props.history.push("/admin?page=post-infor");
  };

  toCreatePost = () => {
    this.setState({
      selectedKey: "createPost",
      showUserInfor: false,
      showProductInfor: false,
      showPostInfor: false,
      showCartInfor: false,
      showCreateProduct: false,
      showCreatePost: true,
      showConversionPaper: false,
    });
    this.props.history.push("/admin?page=create-post");
  };

  toCartInfor = () => {
    this.setState({
      selectedKey: "cartInfor",
      showUserInfor: false,
      showProductInfor: false,
      showPostInfor: false,
      showCartInfor: true,
      showCreateProduct: false,
      showCreatePost: false,
      showConversionPaper: false,
    });
    this.props.history.push("/admin?page=cart-infor");
  };

  toConversionPaper = () => {
    this.setState({
      selectedKey: "conversionPaper",
      showUserInfor: false,
      showProductInfor: false,
      showPostInfor: false,
      showCartInfor: false,
      showCreateProduct: false,
      showCreatePost: false,
      showConversionPaper: true,
    });
    this.props.history.push("/admin?page=conversion-paper");
  };

  parentProp = (key) => {
    if (key === "productInfor") {
      this.setState({
        selectedKey: "inforProduct",
        showUserInfor: false,
        showProductInfor: true,
        showPostInfor: false,
        showCartInfor: false,
        showCreateProduct: false,
        showCreatePost: false,
        showConversionPaper: false,
      });
      this.props.history.push("/admin?page=product-infor");
    }
    if (key === "postInfor") {
      this.setState({
        selectedKey: "postInfor",
        showUserInfor: false,
        showProductInfor: false,
        showPostInfor: true,
        showCartInfor: false,
        showCreateProduct: false,
        showCreatePost: false,
        showConversionPaper: false,
      });
      this.props.history.push("/admin?page=post-infor");
    }
  };
  render() {
    const { selectedKey } = this.state;
    const roles = window.localStorage.getItem("roles");
    return roles === "admin" || roles === "mod" ? (
      <div>
        <NavBar />
        <div style={{ width: "100%", height: "82vh", marginTop: "81px" }}>
          <div className="admin-content-container">
            <div style={{ width: 256 ,position:"fixed", height:"100%"}}>
              <Menu
                selectedKeys={[`${selectedKey}`]}
                mode="inline"
                inlineCollapsed={this.state.collapsed}
              >
                <Menu.Item
                  key="userInfor"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "44px",
                  }}
                  onClick={this.toUserInfor}
                >
                  <Icon type="user" />
                  <span style={{ marginLeft: 0 }}>Quản lí người dùng</span>
                </Menu.Item>
                <SubMenu
                  key="sub1"
                  title={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <Icon type="appstore" />
                      <span>Quản lí sản phẩm</span>
                    </span>
                  }
                >
                  <Menu.Item key="inforProduct" onClick={this.toProductInfor}>
                    Thông tin sản phẩm
                  </Menu.Item>
                  <Menu.Item key="createProduct" onClick={this.toCreateInfor}>
                    Đăng sản phẩm
                  </Menu.Item>
                </SubMenu>
                <SubMenu
                  key="post"
                  title={
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <Icon type="read" />
                      <span>Quản lí bài viết</span>
                    </span>
                  }
                >
                  <Menu.Item key="postInfor" onClick={this.toPostInfor}>
                    Thông tin bài viết
                  </Menu.Item>
                  <Menu.Item key="createPost" onClick={this.toCreatePost}>
                    Đăng bài viết
                  </Menu.Item>
                </SubMenu>
                <Menu.Item
                  key="cartInfor"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "44px",
                  }}
                  onClick={this.toCartInfor}
                >
                  <Icon style={{ marginLeft: 0 }} type="reconciliation" />
                  <span style={{ marginLeft: 0 }}>Quản lí đơn hàng</span>
                </Menu.Item>
                <Menu.Item
                  key="conversionPaper"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "44px",
                  }}
                  onClick={this.toConversionPaper}
                >
                  <Icon style={{ marginLeft: 0 }} type="area-chart" />
                  <span style={{ marginLeft: 0 }}>Quản lí tỉ giá giấy</span>
                </Menu.Item>
              </Menu>
            </div>
            <div className="component-container">
              {this.state.showUserInfor ? <UserInforList /> : null}
              {this.state.showProductInfor ? <ProductInforList /> : null}
              {this.state.showCreateProduct ? (
                <CreateProduct parent={this.parentProp} />
              ) : null}
              {this.state.showPostInfor ? <PostInforList /> : null}
              {this.state.showCreatePost ? (
                <CreatePost parent={this.parentProp} />
              ) : null}
              {this.state.showCartInfor ? <CartInforList /> : null}
              {this.state.showConversionPaper ? <ConversionPaper /> : null}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    );
  }
}

export default withRouter(LayoutAdmin);
