import React, { Component } from "react";
import "../css/shopping-cart.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { InputNumber, Modal, message, Table } from "antd";
import { connect } from "react-redux";
import ConvensionTypes from "../redux/paper-conversion-redux";
import HomePageTypes from "../redux/home-page-redux";

class ShoppingCart extends Component {
  state = {
    quantity: 1,
    visibleDelete: false,
    paymentOption: "",
    idRemove: "",
    totalCash: 0,
    remainingAmout: 0,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    const { convensionRate } = this.props;
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    let total = 0;
    cart.map((e) => {
      total = total + e.ProductPrice * e.quatityBuy;
    });
    this.setState({
      totalCash: total,
      remainingAmout: total,
    });
    this.props.getPaperConvension();
    let numberOfTotal = 0;
    cart.map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
    this.props.setDataCart(numberOfTotal);
  };

  getQuantity = (elementItem, value) => {
    if (value == "" || value == null) value = 1;
    // Check san pham goi API o day
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    const indexNumber = cart.findIndex(
      (element) => element.ProductID === elementItem.ProductID
    );
    cart[indexNumber].quatityBuy = value;
    localStorage.setItem("cart", JSON.stringify(cart));
    let total = 0;
    cart.map((e) => {
      total = total + e.ProductPrice * e.quatityBuy;
    });
    let numberOfTotal = 0;
    cart.map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
    this.props.setDataCart(numberOfTotal);
    this.setState({
      quantity: value,
      totalCash: total,
    });
  };

  showModal = (ProductID) => {
    this.setState({
      visible: true,
      idRemove: ProductID,
    });
  };

  componentDidUpdate() { }

  handleOk = (e) => {
    const { idRemove } = this.state;
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    localStorage.setItem(
      "cart",
      JSON.stringify(cart.filter((element) => element.ProductID !== idRemove))
    );
    let total = 0;
    cart
      .filter((element) => element.ProductID !== idRemove)
      .map((e) => {
        total = total + e.ProductPrice * e.quatityBuy;
      });
    let numberOfTotal = 0;
    cart
      .filter((element) => element.ProductID !== idRemove)
      .map((e) => (numberOfTotal = numberOfTotal + e.quatityBuy));
    this.props.setDataCart(numberOfTotal);
    this.setState({
      visible: false,
      idRemove: "",
      totalCash: total,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      idRemove: "",
    });
  };

  handleOptionChange = (value) => {
    this.setState({
      paymentOption: value,
    });
  };

  onPaperChange = (value) => {
    const sotienthieu =
      this.state.totalCash - value * this.props.convensionRate;
    this.setState({
      remainingAmout: this.state.totalCash - value * this.props.convensionRate,
    });
  };

  confirmPayment = () => {
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      message.error("Chưa có sản phẩm trong giỏ hàng !");
    } else {
      this.props.history.push("/confirm-payment");
    }
  };
  render() {
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
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
        ),
      },
      {
        title: "Giá Tiền | Số Lượng Giấy",
        dataIndex: "age",
        render: (text, record) => (
          <div>
            <span>{record.ProductPrice.replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            )} VNĐ</span>
            <span className="mr-2 ml-2">|</span>
            <span>
              {/* {Math.floor(record.ProductPrice / this.props.convensionRate)} */}
              {Number(
                (record.ProductPrice / this.props.convensionRate).toFixed(1)
              )}{" "}
              Kg
            </span>
          </div>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "address",
        render: (text, record) => (
          <InputNumber
            type="number"
            min={1}
            max={record.Quantity}
            value={record.quatityBuy || 1}
            onChange={(value) => this.getQuantity(record, value)}
          />
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <img
            onClick={(event) => this.showModal(record.ProductID)}
            style={{ cursor: "pointer", width: "25px" }}
            src={require("../images/svgIcon/delete.svg")}
            alt=""
          />
        ),
      },
    ];
    const { totalCash } = this.state;
    const { convensionRate } = this.props;
    return (
      <div>
        <NavBar />
        <div className="cart-wrapper">
          <div className="payment-infor">
            <div className="list-item-infor">
              <Table
                columns={columns}
                dataSource={JSON.parse(window.localStorage.getItem("cart"))}
                style={{ width: "100%" }}
                pagination={false}
                rowkey="id"
              />
            </div>
            <div className="total-money">
              <div className="total-money-card">
                <p className="text-bill">Chi tiết hóa đơn:</p>
                {this.state.paymentOption == "2" ? (
                  <div className="text-total-money-disable">
                    <span>Tổng số tiền</span>

                    <span style={{ fontWeight: "bold" }}>{totalCash.toString().replace(
                      /(\d)(?=(\d{3})+(?!\d))/g,
                      "$1,"
                    )} VNĐ</span>
                  </div>
                ) : (
                    <div className="text-total-money">
                      <span>Tổng số tiền</span>
                      <span style={{ fontWeight: "bold" }}>{totalCash.toString().replace(
                        /(\d)(?=(\d{3})+(?!\d))/g,
                        "$1,"
                      )} VNĐ</span>
                    </div>
                  )}
                {this.state.paymentOption == "1" ? (
                  <div className="text-total-money-disable">
                    <span>Tổng số giấy</span>
                    <span style={{ fontWeight: "bold" }}>
                      {/* {Math.floor(totalCash / convensionRate)} kg */}
                      {Number((totalCash / convensionRate).toFixed(1))} Kg
                    </span>
                  </div>
                ) : (
                    <div className="text-total-money">
                      <span>Tổng số giấy</span>
                      <span style={{ fontWeight: "bold" }}>
                        {/* {Math.floor(totalCash / convensionRate)} kg */}
                        {Number((totalCash / convensionRate).toFixed(1))} Kg
                    </span>
                    </div>
                  )}

                <div className="button-check-out" onClick={this.confirmPayment}>
                  <span>Tiến hành thanh toán </span>
                </div>
              </div>
            </div>
          </div>
          <Modal
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="Xác nhận"
            cancelText="Hủy bỏ"
          >
            <p>Xóa sản phẩm khỏi giỏ hàng?</p>
          </Modal>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    convensionRate: state.convension.convensionRate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaperConvension: () => {
      dispatch(ConvensionTypes.getConvensionRequest());
    },
    setDataCart: (param) => {
      dispatch(HomePageTypes.updateStateCart(param));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
