import React, { Component } from "react";
import "../../css/login.css";
import { Form, Icon, Input, Modal, message, Spin } from "antd";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import LoginTypes from "../../redux/login-redux";
import NavBar from '../../components/NavBar'
import { withRouter } from "react-router";

const emailRegex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;
const userNameRegex = /^([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+)$/i;
message.config({
  top: 100,
});

class Login extends Component {
  state = {
    className: "login-container",
    visible: false,
    processing: true,
    show: true,
    username: "",
    reEmail: "",
    rePassword: "",
    logEmail: "",
    logPassword: "",
    statusLoading: false,
  };
  // ,
  // "devDependencies": {
  //   "jest": "^25.3.0"
  // }
  // componentDidMount() {
  //   this._animation = lottie.loadAnimation({
  //     container: document.getElementById("animationDOM"), // render vao dau
  //     renderer: "svg",
  //     animationData: animationFile, //
  //     loop: true,
  //     autoplay: true,
  //   });
  // }

  handleSignInClick = () => {
    if (this.state.className === "login-container") {
      this.setState({
        className: "login-container right-panel-active",
      });
    } else {
      this.setState({
        className: "login-container",
      });
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields(["resetEmail"], (err, values) => {
      if (!err) {
        const params = {
          email: values.resetEmail,
        }
        this.props.forgotPassword({
          params,
          callback: () => {
            this.setState({
              visible: false,
            });
          }
        });
        this.props.form.resetFields();
      }
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  // componentDidUpdate() {
  //   //if login succeed => redirect to homepage
  //   if (this.props.loginSuccess) {
  //     // this.props.history.push("/");
  //     setTimeout(() => {
  //       this.props.history.push("/");
  //     }, 1000);
  //   }

  //   if (this.props.registerSuccess) {
  //     this.props.updateNotify();
  //     this.setState({
  //       className: "login-container",
  //     });
  //   }

  //   if (this.props.forgotSuccess) {
  //     this.props.updateNotify();
  //     this.setState({
  //       visible: false,
  //     });
  //   }
  // }

  handleSignUpSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(
      ["username", "reEmail", "rePassword"],
      (err, values) => {
        if (!err) {
          const params = {
            username: values.username.replace(/\s+/g, " ").trim(),
            email: values.reEmail,
            password: values.rePassword
          }
          this.props.userRegister({
            params,
            callback: () => {
              this.setState({
                className: "login-container",
              });
            }
          });
          this.props.form.resetFields();
        }
      }
    );
  };

  handleSignInSubmit = (e) => {
    // e.preventDefault();

    this.props.form.validateFields(
      ["logEmail", "logPassword"],
      (err, values) => {
        if (!err) {
          this.setState({
            statusLoading: true,
          });
          setTimeout(() => {
            this.props.userLogin({
              email: values.logEmail,
              password: values.logPassword,
              callback: (value) => {
                if (value) {
                  this.setState({
                    statusLoading: false,
                  });
                  this.props.form.resetFields();
                  this.props.history.push("/");
                } else {
                  this.setState({
                    statusLoading: false,
                  });
                  this.props.form.resetFields();
                }
              },
            });
          }, 200);
        }
      }
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { statusLoading } = this.state;
    const antIcon = (
      <Icon type="loading-3-quarters" style={{ fontSize: 100 }} spin />
    );
    return (
      <div>
        {statusLoading ? (
          <div
            style={{
              zIndex: "200",
              background: "#d9d9d98f",
              height: "100vh",
              width: "100vw",
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin indicator={antIcon} />
          </div>
        ) : null}
        <NavBar />
        <div className="login-wrapper">

          <div className={this.state.className}>

            <div className="form-container sign-up-container">
              <div className="form-intro">
                <h2>Tạo tài khoản</h2>
                <div className="logo-container">
                  <img
                    style={{ width: "80px", height: "80px" }}
                    src={require("../../images/logo.png")}
                  ></img>
                </div>
                <div className="login-form-container">
                  <Form className="login-form">
                    <Form.Item>
                      {getFieldDecorator("username", {
                        initialValue: this.state.username,
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
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Tên người dùng"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("reEmail", {
                        initialValue: this.state.reEmail,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập email của bạn",
                          },
                          {
                            pattern: emailRegex,
                            message: "Vui lòng nhập đúng định dạng email",
                          },
                        ],
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="mail"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="abc@gmail.com"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("rePassword", {
                        initialValue: this.state.rePassword,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu của bạn",
                          },
                          {
                            pattern: passwordRegex,
                            message:
                              "Mật khẩu phải dài từ 8-10 kí tự, chứa số, kí tự đặc biệt, chữ thường và in hoa",
                          },
                        ],
                      })(
                        <Input.Password
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          type="password"
                          placeholder="Mật khẩu"
                        />
                      )}
                    </Form.Item>
                    <button
                      className="btn-sign-up"
                      onClick={this.handleSignUpSubmit}
                    >
                      Đăng kí
                    </button>
                  </Form>
                </div>
              </div>
            </div>
            <div className="form-container sign-in-container">
              <div className="form-intro">
                <h1>Đăng Nhập</h1>
                <div className="logo-container">
                  <img
                    style={{ width: "80px", height: "80px" }}
                    src={require("../../images/logo.png")}
                  ></img>
                </div>
                <div className="login-form-container">
                  <Form className="login-form">
                    <Form.Item>
                      {getFieldDecorator("logEmail", {
                        initialValue: this.state.logEmail,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập email của bạn",
                          },
                        ],
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="mail"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          placeholder="Email"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator("logPassword", {
                        initialValue: this.state.logPassword,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu của bạn",
                          },
                        ],
                      })(
                        <Input.Password
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          type="password"
                          placeholder="Mật khẩu"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <p
                        className="login-form-forgot"
                        href=""
                        onClick={this.showModal}
                      >
                        Bạn đã quên mật khẩu?
                      </p>
                    </Form.Item>
                    <button
                      className="btn-sign-in"
                      onClick={this.handleSignInSubmit}
                    >
                      Đăng nhập
                    </button>
                  </Form>
                </div>
              </div>
            </div>
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1 className="intro-title-1">Bạn đã sẵn sàng chưa ?</h1>
                  <p className="text-intro">
                    Hãy đăng nhập và cùng The Green Way chung sức bảo vệ mái nhà
                    xanh.
                  </p>
                  <button
                    className="ghost btn-sign-up"
                    id="signIn"
                    onClick={this.handleSignInClick}
                  >
                    Đăng Nhập
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="intro-title-2">Chào bạn!</h1>
                  <p className="text-intro">
                    The Green Way mong muốn cùng bạn tạo nên những giá trị xanh
                    cho cuộc sống.
                  </p>
                  <button
                    className="ghost btn-sign-in"
                    id="signUp"
                    onClick={this.handleSignInClick}
                  >
                    Đăng kí
                  </button>
                </div>
              </div>
            </div>
            <Modal
              title="Nhập email của bạn để đặt lại mật khẩu"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText="Xác nhận"
              cancelText="Hủy bỏ"
            >
              <Form className="login-form">
                <Form.Item>
                  {getFieldDecorator("resetEmail", {
                    rules: [{ required: true, message: "Vui lòng nhập email" }],
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="mail"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="text"
                      placeholder="Ví dụ abc@gmail.com"
                    />
                  )}
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    errorCode: state.userLogin.errorCode,
    forgotMessage: state.userLogin.forgotMessage,
    loginSuccess: state.userLogin.loginSuccess,
    registerSuccess: state.userLogin.registerSuccess,
    forgotSuccess: state.userLogin.forgotSuccess,
    notifyMessage: state.userLogin.notifyMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (userInfor) => {
      dispatch(LoginTypes.loginRequest(userInfor));
    },
    userRegister: (reInfor) => {
      dispatch(LoginTypes.signUpRequest(reInfor));
    },
    forgotPassword: (email) => {
      dispatch(LoginTypes.forgotRequest(email));
    },
    updateNotify: () => {
      dispatch(LoginTypes.updateNotify());
    },
  };
};

Login = withRouter(Login);
const LoginScreen = Form.create()(Login);
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
