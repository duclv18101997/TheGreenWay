import React, { Component } from "react";
import "../css/order-history-detail.css";
import { connect } from "react-redux";
import NavBar from "../components/NavBar";
import { Table, Button } from "antd";
import UserOrderHistoryTypes from "../redux/user-order-history-redux";
import queryString from "query-string";

var moment = require("moment");
class OrderHistoryDetail extends Component {
  componentDidMount() {
    const id = queryString.parse(this.props.history.location.search);
    if (id.token) {
      const params = {
        token: id.token
      };
      this.props.getOrderDetailByGuest(params);
    } else {
      const params = {
        idOrder: id.idOrder
      };
      this.props.getOrderDetail(params);
    }
  }

  backToOrderList = () => {
    this.props.history.push("/user-order-history");
  };

  render() {
    const columns = [
      {
        title: "Tên Sản Phẩm",
        dataIndex: "ProductName",
        render: (text, record) => (
          <div>
            <img
              style={{ height: "80px", width: "80px", borderRadius: "5px" }}
              src={record.ImageDetail}
              alt=""
            />
            <span style={{ fontSize: "18px", marginLeft: "5%" }}>
              {record.ProductName}
            </span>
          </div>
        )
      },
      {
        title: "Tổng số tiền",
        dataIndex: "age",
        render: (text, record) => (
          <div>
            <span>{record.Price ? record.Price.toString().replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            ): ''} VNĐ</span>
          </div>
        )
      },
      {
        title: "Số lượng",
        dataIndex: "address",
        render: (text, record) => (
          <div>
            <span>{record.QuantityProduct}</span>
          </div>
        )
      }
    ];

    const { orderInfor, cartInfor } = this.props;
    const token = window.localStorage.getItem('token')
    return (
      <div>
        <NavBar />
        <div className="order-detail-wrapper">
          <div className="order-infor-container">
            <div className="order-infor-left">
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                Thông tin giỏ hàng:
              </p>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">Tổng số tiền:</span>{" "}
                <span>{cartInfor.TotalPrice ? cartInfor.TotalPrice.toString().replace(
                  /(\d)(?=(\d{3})+(?!\d))/g,
                  "$1,"
                ) : ''} VND</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">Tiền mặt:</span>{" "}
                <span>{cartInfor.Cash ? cartInfor.Cash.toString().replace(
                  /(\d)(?=(\d{3})+(?!\d))/g,
                  "$1,"
                ) : ''} VND</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">Giấy:</span>{" "}
                <span>{cartInfor.QuantityPaper} Kg</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">
                  Địa chỉ giao hàng:
                </span>{" "}
                <span>{cartInfor.ShipAddress}</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">
                  Trạng thái đơn hàng:
                </span>{" "}
                <span>{cartInfor.Description}</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">Ngày mua:</span>{" "}
                <span>{moment(cartInfor.CreateDate).format("DD/MM/YYYY")}</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">Ngày nhận hàng:</span>{" "}
                <span>{moment(cartInfor.EndDate).format("DD/MM/YYYY")}</span>
              </div>
              <div style={{ display: "flex" }}>
                <span className="mr-4 order-infor-title">Ngày chỉnh sửa:</span>{" "}
                <span>{moment(cartInfor.ModifyDate).format("DD/MM/YYYY")}</span>
              </div>
            </div>
            {!token ? (
              <div className="order-infor-right">
                <Button type="primary" onClick={this.backToOrderList}>
                  Quay lại
              </Button>
              </div>
            ) : (
                <div></div>
              )}
          </div>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            Danh sách sản phẩm:
          </p>
          <Table
            dataSource={orderInfor}
            columns={columns}
            pagination={false}
            rowkey="id"
          ></Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orderInfor: state.userOrderHistory.orderDetail,
    cartInfor: state.userOrderHistory.cartInfor,
    guestCartInfor: state.userOrderHistory.guestCartInfor
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getOrderDetail: params => {
      dispatch(UserOrderHistoryTypes.getUserOrderDetailRequest(params));
    },
    getOrderDetailByGuest: params => {
      dispatch(UserOrderHistoryTypes.getOrderDetailByGuestRequest(params));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryDetail);
