import React, { Component } from "react";
import "../css/confirm-payment.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import ConvensionTypes from "../redux/paper-conversion-redux";
import OrderCartTypes from "../redux/order-card-redux";
import queryString from "query-string";
import { Form, Input, InputNumber, Select } from "antd";
const { Option } = Select;
const { TextArea } = Input;

var moment = require("moment");
const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
const emailRegex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
const userNameRegex = /^([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+)$/i;

class ConfirmPayment extends Component {
  state = {
    totalCash: 0,
    paymentOption: "1",
    methodPayment: "1",
    remainingAmout: 0,
    QuantityPaper: 0,
  };

  componentDidMount = () => {
    // const dataId = queryString.parse(this.props.history.location.search);
    this.props.getPaperConvension();
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    let total = 0;
    cart.map((e) => {
      total = total + e.ProductPrice * e.quatityBuy;
    });
    this.setState({
      totalCash: total,
      remainingAmout: total,
    });
  };

  onPaperChange = (value) => {
    this.setState({
      QuantityPaper: value,
    });
    const sotienthieu =
      this.state.totalCash - value * this.props.convensionRate;
    this.setState({
      remainingAmout: this.state.totalCash - value * this.props.convensionRate,
    });
  };

  handleSelectChange = (value) => { };

  handleOptionChange = (value) => {
    this.setState({
      paymentOption: value,
    });
  };

  getPaymentMethod = () => {
    this.props.form.validateFields(
      ["paymentMethod"],
      (err, values) => {
        if (!err) {
          if (values.paymentMethod === "1") {
            this.setState({
              methodPayment: "1"
            })
          } else {
            this.setState({
              methodPayment: "2",
            })
            if(this.state.paymentOption === "2"){
              this.setState({
                paymentOption: "1"
              })
            }
          }
        }
      }
    );
  }

  orderSuccess = () => {
    const token = window.localStorage.getItem("x-access-token");
    if (token) {
      this.props.form.validateFieldsAndScroll((err, fieldsValues) => {
        if (!err) {
          // var totalPaper = Math.floor(
          //   this.state.totalCash / this.props.convensionRate
          // );
          var totalPaper = Number(
            (this.state.totalCash / this.props.convensionRate).toFixed(1)
          );
          var totalMoney = this.state.totalCash;
          var cash = 0;
          var check = this.state.paymentOption;
          const cart = JSON.parse(window.localStorage.getItem("cart"));
          if (this.state.paymentOption === "1") {
            totalPaper = 0;
            cash = totalMoney;
          }
          if (this.state.paymentOption === "2") {
            // if(Number(this.state.QuantityPaper) === 0){
            //   return
            // }
          }
          if (this.state.paymentOption === "3") {
            totalPaper = this.state.QuantityPaper;
            cash = this.state.remainingAmout;
          }
          const params = {
            PaymentID: fieldsValues.paymentMethod,
            ConversionID: this.props.convensionId,
            TotalPrice: totalMoney,
            ShipAddress: fieldsValues.address,
            CreateDate: moment().format("YYYY-MM-DD"),
            QuantityPaper: totalPaper,
            Cash: cash,
            cart: cart.map((ele) => ({
              ProductName: ele.ProductName,
              id: ele.ProductID,
              quatity: ele.Quantity,
              price: ele.ProductPrice,
              quatityBuy: ele.quatityBuy == null ? "0" : ele.quatityBuy,
            })),
          };
          this.props.sendOrderCart({
            params,
            method: "user",
            callbackA: () => {
              window.localStorage.removeItem("cart");
              this.props.history.push("/order-success");
            },
          });
        }
      });
    } else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          // var totalPaper = Math.floor(
          //   this.state.totalCash / this.props.convensionRate
          // );
          var totalPaper = Number(
            (this.state.totalCash / this.props.convensionRate).toFixed(1)
          );
          var totalMoney = this.state.totalCash;
          var cash = 0;
          var check = this.state.paymentOption;
          const cart = JSON.parse(window.localStorage.getItem("cart"));
          if (this.state.paymentOption === "1") {
            totalPaper = 0;
            cash = totalMoney;
          }
          if (this.state.paymentOption === "2") {
          }
          if (this.state.paymentOption === "3") {
            totalPaper = this.state.QuantityPaper;
            cash = this.state.remainingAmout;
          }
          const params = {
            Name: values.fullname,
            Phone: values.phone,
            Email: values.email,
            PaymentID: values.paymentMethod,
            ConversionID: this.props.convensionId,
            TotalPrice: totalMoney,
            ShipAddress: values.address,
            CreateDate: moment().format("YYYY-MM-DD"),
            QuantityPaper: totalPaper,
            Cash: cash,
            cart: cart.map((ele) => ({
              ProductName: ele.ProductName,
              id: ele.ProductID,
              quatity: ele.Quantity,
              price: ele.ProductPrice,
              quatityBuy: ele.quatityBuy,
            })),
          };
          this.props.sendOrderCart({
            params,
            method: "guest",
            callbackA: (token) => {
              window.localStorage.setItem("token", token);
              window.localStorage.removeItem("cart");
              this.props.history.push("/order-success");
            },
          });
        }
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 23 },
        sm: { span: 23 },
        md: { span: 23 },
        lg: { span: 18 },
      },
    };
    const token = window.localStorage.getItem("x-access-token");
    const cart = JSON.parse(window.localStorage.getItem("cart"));
    const { totalCash } = this.state;
    const { convensionRate, userInformation } = this.props;
    return (
      <div>
        <NavBar />
        <div className="cart-wrapper">
          <div className="payment-infor">
            <div className="customer-infor">
              <div className="confirm-title">
                <p>Cảm ơn quý khách đã mua sản phẩm của chúng tôi</p>
                <p>Vui lòng xác nhận các thông tin dưới đây:</p>
              </div>
              {token ? (
                <div>
                  <Form {...formItemLayout} className="mt-4">
                    <Form.Item label="Họ và tên">
                      {getFieldDecorator("fullname", {
                        initialValue: userInformation.username,
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: "Vui lòng nhập tên người dùng",
                          },
                          {
                            min: 6,
                            message: "Tên người dùng phải dài ít nhất 6 kí tự",
                          },
                          {
                            max: 32,
                            message: "Tên người dùng không dài quá 32 kí tự",
                          },
                          {
                            pattern: userNameRegex,
                            message:
                              "Tên người dùng không được chưa kí tự đặc biệt và số",
                          },
                        ],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                      {getFieldDecorator("phone", {
                        initialValue: userInformation.phone,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại người dùng",
                          },
                          {
                            pattern: phoneRegex,
                            message: "Nhập đúng định dạng số điện thoại",
                          },
                        ],
                      })(<Input type="number" />)}
                    </Form.Item>

                    <Form.Item label="Nhập địa chỉ giao hàng:">
                      {getFieldDecorator("address", {
                        initialValue: userInformation.address,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập địa chỉ muốn giao hàng",
                          },
                        ],
                      })(<TextArea rows={4} />)}
                    </Form.Item>
                    <Form.Item label="Lựa chọn phương thức thanh toán">
                      {getFieldDecorator("paymentMethod", {
                        initialValue: this.state.methodPayment,
                      })(
                        <Select
                        style={{ width: 200 }}
                        {...this.props}
                        onSelect={this.getPaymentMethod}
                        >
                          <Option value="1">Ship COD</Option>
                          <Option value="2">Chuyển Khoản</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                  <div>
                    <Form {...formItemLayout} className="mt-4">
                      <Form.Item label="Họ và tên">
                        {getFieldDecorator("fullname", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng nhập tên người dùng",
                            },
                            {
                              min: 6,
                              message: "Tên người dùng phải dài ít nhất 6 kí tự",
                            },
                            {
                              max: 32,
                              message: "Tên người dùng không dài quá 32 kí tự",
                            },
                            {
                              pattern: userNameRegex,
                              message:
                                "Tên người dùng không được chưa kí tự đặc biệt và số",
                            },
                          ],
                        })(<Input />)}
                      </Form.Item>
                      <Form.Item label="Số điện thoại">
                        {getFieldDecorator("phone", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng nhập số điện thoại người dùng",
                            },
                            {
                              pattern: phoneRegex,
                              message: "Nhập đúng định dạng số điện thoại",
                            },
                          ],
                        })(<Input type="number" />)}
                      </Form.Item>
                      <Form.Item label="Email">
                        {getFieldDecorator("email", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng nhập địa chỉ email",
                            },
                            {
                              pattern: emailRegex,
                              message: "Vui lòng nhập đúng định dạng email",
                            },
                          ],
                        })(<Input style={{ width: "100%" }} />)}
                      </Form.Item>
                      <Form.Item label="Nhập địa chỉ giao hàng:">
                        {getFieldDecorator("address", {
                          rules: [
                            {
                              required: true,
                              message: "Vui lòng nhập địa chỉ muốn giao hàng",
                            },
                          ],
                        })(<TextArea rows={4} />)}
                      </Form.Item>
                      <Form.Item label="Lựa chọn phương thức thanh toán">
                        {getFieldDecorator("paymentMethod", {
                          initialValue: this.state.methodPayment,
                        })(
                          <Select
                            {...this.props}
                            style={{ width: 200 }}
                            onSelect={this.getPaymentMethod}
                          >
                            <Option value="1">Ship COD</Option>
                            <Option value="2">Chuyển Khoản</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Form>
                  </div>
                )}
              <div>
                {
                  this.state.methodPayment === "2" ? (
                    <div>
                      <p style={{ fontWeight: "bold" }}>
                        Nếu thanh toán chuyển khoản, quý khách vui lòng chuyển khoản
                        trước theo thông tin dưới đây
                  </p>
                      <p>Tên chủ tài khoản: Lê Văn Đức</p>
                      <p>Số tài khoản: 45210000478382</p>
                      <p>Ngân hàng: BIDV chi nhánh Thạch Thất</p>
                    </div>
                  ) : (
                      <div>
                        <p style={{ fontWeight: "bold" }}>Nếu thanh toán ship COD</p>
                        <p>Quý khách sẽ thanh toán khi nhận được hàng tại nhà</p>
                      </div>
                    )
                }

              </div>
            </div>
            <div className="bill-infor-wrapper">
              <div className="bill-infor-container">
                <p className="text-bill">Thông tin đơn hàng:</p>
                <div className="text-bill-detail-title">
                  <span>Sản phẩm</span>
                  <span>Số lượng</span>
                </div>
                <div className="text-bill-detail-container">
                  {(cart || []).map((item, index) => {
                    return (
                      <div className="text-bill-detail" key={index}>
                        <span style={{ flex: "5", marginRight: "15px" }}>
                          {item.ProductName}
                        </span>
                        <span style={{ fontWeight: "bold", flex: "1" }}>
                          {item.quatityBuy}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-bill-total-money">
                  <span>Tổng số tiền</span>
                  <span style={{ fontWeight: "bold" }}>
                    {this.state.totalCash.toString().replace(
                        /(\d)(?=(\d{3})+(?!\d))/g,
                        "$1,"
                      )} VNĐ
                  </span>
                </div>
                <div className="text-bill-detail">
                  <span>Tổng số giấy</span>
                  <span style={{ fontWeight: "bold" }}>
                    {/* {Math.floor(totalCash / convensionRate)} Kg */}
                    {Number((totalCash / convensionRate).toFixed(1))} Kg
                  </span>
                </div>
                <div className="payment-option mt-3">
                  <span style={{ fontSize: "18px", marginBottom: "10px" }}>
                    Chọn hình thức thanh toán:
                  </span>
                  {
                    this.state.methodPayment === "1" ? (
                      <Select
                        style={{ width: 200, marginBottom: "10px" }}
                        onChange={this.handleOptionChange}
                        value={this.state.paymentOption}
                      >
                        <Option value="1">Tiền</Option>
                        <Option
                          value="2"
                          disabled={
                            Number((totalCash / convensionRate).toFixed(1)) === 0
                              ? true
                              : false
                          }
                        >
                          Giấy
                    </Option>
                        <Option
                          value="3"
                          disabled={
                            Number((totalCash / convensionRate).toFixed(1)) === 0
                              ? true
                              : false
                          }
                        >
                          Cả hai
                    </Option>
                      </Select>
                    ) : (
                        <Select
                          style={{ width: 200, marginBottom: "10px" }}
                          onChange={this.handleOptionChange}
                          value={this.state.paymentOption}
                        >
                          <Option value="1">Tiền</Option>
                          <Option
                            value="3"
                            disabled={
                              Number((totalCash / convensionRate).toFixed(1)) === 0
                                ? true
                                : false
                            }
                          >
                            Cả hai
                    </Option>
                        </Select>
                      )
                  }
                  {this.state.paymentOption == 3 ? (
                    <div className="show-option-payment">
                      <div className="money-input mb-1">
                        <span>Nhập số kg giấy: </span>
                        <InputNumber
                          type="number"
                          min={0}
                          // max={Math.floor(totalCash / convensionRate)}
                          max={Number((totalCash / convensionRate).toFixed(1))}
                          // value={0}
                          placeholder="Nhập số kg giấy"
                          onChange={(value) => this.onPaperChange(value)}
                          style={{ width: "135px" }}
                        />
                      </div>
                      <div className="money-input">
                        <span>Số tiền còn thiếu: </span>
                        <InputNumber
                          readOnly
                          min={1}
                          value={this.state.remainingAmout}
                          disabled
                          style={{ width: "135px" }}
                        />
                      </div>
                    </div>
                  ) : (
                      <div className="show-option-payment"></div>
                    )}
                </div>
                <div className="button-check-out" onClick={this.orderSuccess}>
                  <span>Đặt hàng </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInformation: state.homePage.userInformation,
    convensionRate: state.convension.convensionRate,
    convensionId: state.convension.convensionId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaperConvension: () => {
      dispatch(ConvensionTypes.getConvensionRequest());
    },
    sendOrderCart: (params) => {
      dispatch(OrderCartTypes.getOrderCartRequest(params));
    },
  };
};
const ConfirmPaymentScreen = Form.create()(ConfirmPayment);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmPaymentScreen);
