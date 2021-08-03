import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/ForgotPassword";
import EditProfile from "../pages/profile/EditProfile";
import Index from "../pages/Index";
import ChangePassword from "../pages/profile/ChangePassword";
import LayoutProfile from "../layout/LayoutProfile";
import AboutUs from "../pages/AboutUs";
import ProductList from "../pages/ProductList";
import ProductDetail from "../pages/ProductDetail";
import ShoppingCart from "../pages/ShoppingCart";
import LifeWay from "../pages/lifeWayPage/lifeWayPage.jsx";
import PlantProductDetail from "../pages/PlantProductsDetail";
import RecycleProducDetail from "../pages/RecycleProductDetail";
import LifeWayPageDetail from "../pages/lifeWayPage/lifeWayPageDetail";
import ConfirmPayment from "../pages/ConfirmPayment";
import UserProductLike from "../pages/UserProductLike";
import UserOrderHistory from "../pages/UserOrderHistory";
import OrderSuccess from "../pages/OrderSuccess";
import OrderHistoryDetail from "../pages/OrderHistoryDetail";
import NotFound from "../pages/NotFound";
import LockAccount from "../pages/LockAccount";
import TokenFalse from "../pages/TokenFalse";
import { connect } from "react-redux";

//admin
import LayoutAdmin from "../layout/LayoutAdmin";

class PageLayout extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} exact />
          <Route path="/forgot" component={ForgotPassword} exact />
          <Route path="/" component={Index} exact></Route>
          <Route path="/about-us" component={AboutUs} exact></Route>
          <Route path="/product" component={ProductList} exact></Route>
          <Route path="/life-way" component={LifeWay} exact></Route>
          <Route path="/lock-account" component={LockAccount} exact></Route>
          <Route path="/token-false" component={TokenFalse} exact></Route>
          <Route
            path="/life-way-detail/:id"
            component={LifeWayPageDetail}
            exact
          ></Route>
          <Route
            path="/order-detail/order"
            component={OrderHistoryDetail}
            exact
          ></Route>
          <Route
            path="/product-detail/:id"
            component={ProductDetail}
            exact
          ></Route>
          <Route path="/cart" component={ShoppingCart} exact></Route>
          <Route
            path="/plant-product"
            component={PlantProductDetail}
            exact
          ></Route>
          <Route
            path="/recycle-product"
            component={RecycleProducDetail}
            exact
          ></Route>
          <Route
            path="/confirm-payment"
            component={ConfirmPayment}
            exact
          ></Route>
          <Route path="/order-success" component={OrderSuccess} exact></Route>
          <Route path="/admin" component={LayoutAdmin} exact></Route>
          <LayoutProfile>
            <Route path="/account" component={EditProfile} exact />
            <Route path="/changepassword" component={ChangePassword} exact />
            <Route
              path="/user-order-history"
              component={UserOrderHistory}
              exact
            />
            <Route
              path="/user-product-like"
              component={UserProductLike}
              exact
            />
            <Route component={NotFound}></Route>
          </LayoutProfile>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect()(PageLayout);
