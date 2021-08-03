import React, { Component } from 'react';
import "../css/order-success.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  Button,
} from "antd";

class OrderSuccess extends Component {
  state= {
    guestToken: ''
  }

  componentDidMount() {
    window.localStorage.removeItem('cart')

  }

  toHomePage = () => {
    this.props.history.push('/')
  }

  toOrderDetail = () => {
    const guestToken = window.localStorage.getItem('token')
    this.props.history.push(`/order-detail/order?token=${guestToken}`)
  }
  render() {
    const guestToken = window.localStorage.getItem('token')
    return (
      <div>
        <NavBar />
        <div className="order-success-wrapper">
          <div className="order-success-container shadow bg-white rounded">
            <div className="success-image">
              <img src={require('../images/product-a.png')} />
            </div>
            <div className="success-infor">
              <div className="success-logo">
                <img
                  style={{ width: "175px", height: "58px", cursor: "pointer" }}
                  src={require("../images/logo-1.png")}
                  alt=""
                />
              </div>
              <p className="thank-order">Cảm ơn quý khách</p>
              <div>
                <p>Cảm ơn bạn đã lựa chọn The Green Way để trải nghiệm cho mình phong cách sống xanh,
                lựa chọn những sản phẩm thân thiện với môi trường.
                   </p>
                <p>Đơn hàng đang được xử lí, chúng tôi sẽ giao đến quý khách trong thời gian sớm nhất.
                   </p>
              </div>
              {guestToken? (
                <div>
                  <p>Chúng tôi đã gửi thông tin chi tiết đơn hàng đến email của bạn. Vui lòng kiểm tra email để cập nhật thông tin chi tiết</p>
                  <p>Hoặc bạn có thể xem chi tiết đơn hàng tại đây:</p>
                  <p onClick={this.toOrderDetail}><Button type="primary">Xem đơn hàng</Button></p>
                </div>
              ): (
                <div></div>
              )}
              <div className="button-check-out btn-continue" onClick={this.toHomePage}>
                <span>Tiếp tục mua hàng</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default OrderSuccess;