import React, { Component } from "react";
import "../css/forgot-password.css";
import { Form, Input } from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import ForgotTypes from "../redux/forgot-password-redux";
import { withRouter } from "react-router";
import NavBar from "../components/NavBar";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;
class ForgotPassword extends Component {
  state = {
    className: "login-container",
    show: true
  };

  componentDidMount() {
    window.localStorage.removeItem('x-access-token')
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("2 mật khẩu không khớp");
    } else {
      callback();
    }
  };

  handleConfirmSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(["password", "confirm"], (err, values) => {
      if (!err) {
        const params = {
          password: values.password,
          token: window.location.search.split("?")[1],
          email: window.location.search.split("?")[2],
        }
        this.props.resetPassword({
          params,
          callback: () => {
            this.props.history.push("/login")
          }
        }
        );
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 }
    };
    return (
      <div>
        <NavBar />
        <div className="login-wrapper-forgot">
          <div className={this.state.className}>
            <div className="form-container sign-in-container">
              <div className="form-intro">
                <h1>Đặt lại mật khẩu</h1>
                <div className="logo-container">
                  <img
                    style={{ width: "64px", height: "64px" }}
                    src={require("../images/logo.png")}
                  ></img>
                </div>
                <div className="forgot-form-container">
                  <Form className="login-form">
                    <Form.Item {...formItemLayout} label="Mật khẩu" hasFeedback>
                      {getFieldDecorator("password", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!"
                          },
                          {
                            pattern: passwordRegex,
                            message:
                              "Mật khẩu phải dài từ 8-10 kí tự, chứa số, kí tự đặc biệt, chữ thường và in hoa"
                          }
                        ]
                      })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="Xác nhận mật khẩu"
                      hasFeedback
                    >
                      {getFieldDecorator("confirm", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng xác nhận mật khẩu!"
                          },
                          {
                            validator: this.compareToFirstPassword
                          }
                        ]
                      })(<Input.Password />)}
                    </Form.Item>
                    <button
                      className="btn-reset"
                      onClick={this.handleConfirmSubmit}
                    >
                      Đặt lại
                    </button>
                  </Form>
                </div>
              </div>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-right">
                  <h1 className="intro-title-forgot">Chào bạn!</h1>
                  <p className="text-intro">
                    The Green Way mong muốn cùng bạn tạo nên những giá trị xanh
                    cho cuộc sống.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer/> */}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    notifyMessage: state.forgotPassword.notifyMessage,
    resetMessage: state.forgotPassword.resetMessage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: newPass => {
      dispatch(ForgotTypes.resetRequest(newPass));
    },
    updateNotify: () => {
      dispatch(ForgotTypes.updateNotify());
    }
  };
};

ForgotPassword = withRouter(ForgotPassword);
const ForgotPasswordScreen = Form.create()(ForgotPassword);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordScreen);
