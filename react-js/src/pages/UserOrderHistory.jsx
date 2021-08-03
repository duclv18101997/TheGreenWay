import React, { Component } from "react";
import "../css/user-order-history.css";
import { Table, Button, Pagination } from "antd";
import UserOrderHistoryTypes from "../redux/user-order-history-redux";
import { connect } from "react-redux";

var moment = require("moment");
class UserOrderHistory extends Component {
  state = {
    current: 1
  };

  componentDidMount() {
    const params = {
      page: 1
    };
    this.props.getOrderCart(params);
  }

  toDetailCart = (record) => {
    this.props.history.push(`/order-detail/order?idOrder=${record.OrderID}`)
  }

  onSelectPageChange = page => {
    this.setState({
      current: page
    });
    const params = {
      page: page
    };
    this.props.getOrderCart(params);
  };
  render() {
    const columns = [
      {
        title: "OrderId",
        dataIndex: "index",
        // defaultSortOrder: "descend",
        sorter: (a, b) => a.OrderID - b.OrderID,
        render: (text, record) => (
          <div>
            <span style={{ fontSize: "18px", marginLeft: "5%" }}>
              {record.OrderID}
            </span>
          </div>
        )
      },
      {
        title: "Tổng số tiền",
        dataIndex: "totalMoney",
        sorter: (a, b) => a.TotalPrice - b.TotalPrice,
        render: (text, record) => (
          <div>
            <span>
              {record.TotalPrice === 0 ? "--" : `${record.TotalPrice.toString().replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            )} VNĐ`}
            </span>
          </div>
        )
      },
      {
        title: "Tiền mặt",
        dataIndex: "money",
        sorter: (a, b) => a.Cash - b.Cash,
        render: (text, record) => (
          <div>
            <span>{record.Cash === 0 ? "--" : record.Cash.toString().replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            ) + `VNĐ`}</span>
          </div>
        )
      },
      {
        title: "Giấy",
        dataIndex: "paper",
        sorter: (a, b) => a.QuantityPaper - b.QuantityPaper,
        render: (text, record) => (
          <div>
            <span>
              {record.QuantityPaper === 0 ? "--" : `${record.QuantityPaper} Kg`}
            </span>
          </div>
        )
      },
      {
        title: "Ngày mua",
        dataIndex: "date",
        render: (text, record) => (
          <div>
            <span>{moment(record.CreateDate).format("DD/MM/YYYY")}</span>
          </div>
        )
      },
      {
        title: "Ngày nhận hàng",
        dataIndex: "endDate",
        render: (text, record) => {
          return (
            <div>
              <span>
                {record.EndDate !== "Invalid date"
                  ? moment(record.EndDate).format("DD/MM/YYYY")
                  : "--"}
              </span>
            </div>
          );
        }
      },
      {
        title: "Ngày chỉnh sửa",
        dataIndex: "modifyDate",
        render: (text, record) => (
          <div>
            <span>
              {record.ModifyDate
                ? moment(record.ModifyDate).format("DD/MM/YYYY")
                : "--"}
            </span>
          </div>
        )
      },
      {
        title: "Tình trạng",
        dataIndex: "status",
        filters: [
          {
            text: "Đang Chờ Xử Lý",
            value: "Đang Chờ Xử Lý"
          },
          {
            text: "Đang Giao Hàng",
            value: "Đang Giao Hàng"
          },
          {
            text: "Giao Hàng Thành Công",
            value: "Giao Hàng Thành Công"
          },
          {
            text: "Đơn Hàng Bị Huỷ",
            value: "Đơn Hàng Bị Huỷ"
          }
        ],
        onFilter: (value, record) => record.Description.indexOf(value) === 0,
        render: (text, record) => (
          <div>
            <span>{record.Description}</span>
          </div>
        )
      },
      {
        title: "Tùy chọn",
        dataIndex: "detail",
        render: (text, record) => (
          <Button
            type="primary"
            onClick={() => {
              this.toDetailCart(record);
            }}
          >
            Xem chi tiết
          </Button>
        )
      }
    ];
    const { orderHistoryInfor } = this.props;
    return (
      <div className="user-order">
        <div className="user-order-wrapper">
          <Table
            dataSource={orderHistoryInfor}
            columns={columns}
            pagination={false}
            rowkey="id"
          ></Table>
           {orderHistoryInfor.length !== 0 ? (
          <Pagination
            current={this.state.current}
            onChange={this.onSelectPageChange}
            total={this.props.totalPage * 10}
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "3% 0",
            }}
          />
        ) : null}
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orderHistoryInfor: state.userOrderHistory.orderCardList,
    totalPage: state.userOrderHistory.totalPage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getOrderCart: params => {
      dispatch(UserOrderHistoryTypes.getUserOrderRequest(params));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOrderHistory);
