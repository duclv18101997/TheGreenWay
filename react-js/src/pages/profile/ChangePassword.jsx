import React, { Component } from "react";
import "../../css/profile/edit-profile.css";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import HomePageTypes from "../../redux/home-page-redux";
import EditTypes from "../../redux/edit-profile";
import ChangePassTypes from "../../redux/change-password-redux";
import {
  Form,
  Input,
  Button,
  Col,
  Row,
} from "antd";
import { Redirect } from "react-router-dom";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;

class ChangePassword extends Component {
  state = {
    email: "",
    visibleAccountInfor: false,
    userName: "",
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
    loading: false
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
        phone: this.props.userInformation.phone
      });
      if (this.state.DOB) {
        this.setState({
          DOB: this.state.DOB.slice(0, 10)
        });
      }
    }
    if (this.props.changeMessage) {
      this.props.updateNotify();
      this.setState({
        visiblePassModal: false
      });
      setTimeout(() => {
        window.location.href = "/account";
      }, 2000);
    }
  }

  showPasswordModal = () => {
    this.setState({
      visiblePassModal: true
    });
  };

  handleChangePassSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["oldPassword", "newPassword", "confirmPassword"],
      (err, fieldsValues) => {
        if (!err) {
          this.props.changePass({
            oldpassword: fieldsValues.oldPassword,
            newpassword: fieldsValues.newPassword
          });
        }
      }
    );
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("newPassword")) {
      callback("Mật khẩu không khớp!");
    } else {
      callback();
    }
  };

  handleChangePassSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      ["oldPassword", "newPassword", "confirmPassword"],
      (err, fieldsValues) => {
        if (!err) {
          this.props.changePass({
            oldpassword: fieldsValues.oldPassword,
            newpassword: fieldsValues.newPassword
          });
        }
      }
    );
  };

  handleChangePassCancel = e => {
    this.setState({
      visiblePassModal: false
    });
  };

  render() {
    const token = window.localStorage.getItem("x-access-token");
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 10 }
      }
    };
    return token ? (
      <div className="edit-profile-wrapper">
        {/* <NavBar /> */}
        {/* <LayoutProfile> */}
        <div className="edit-container">
          <div className="edit-form">
            <div className="edit-form-right">
              <div className="information-form" style={{ marginTop: "50px" }}>
                <Form
                  {...formItemLayout}
                  onSubmit={this.handleChangePassSubmit}
                  className="mt-5 ml-5"
                >
                  <Form.Item
                    {...formItemLayout}
                    label="Mật khẩu cũ"
                    hasFeedback
                  >
                    {getFieldDecorator("oldPassword", {
                      rules: [
                        {
                          required: true,
                          message: "Nhập mật khẩu cũ"
                        }
                      ]
                    })(<Input.Password />)}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="Mật khẩu mới"
                    hasFeedback
                  >
                    {getFieldDecorator("newPassword", {
                      rules: [
                        {
                          required: true,
                          message: "Nhập mật khẩu mới"
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
                    {getFieldDecorator("confirmPassword", {
                      rules: [
                        {
                          required: true,
                          message: "Xác nhận lại mật khẩu"
                        },
                        {
                          validator: this.compareToFirstPassword
                        }
                      ]
                    })(<Input.Password />)}
                  </Form.Item>
                  <Row>
                    <Col span={6} offset={7}>
                      <Button
                        // className="edit-button"
                        type="primary"
                        onClick={this.handleChangePassSubmit}
                        style={{ width: "100%", marginTop: "20px" }}
                      >
                        Đổi mật khẩu
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
        {/* </LayoutProfile> */}
        {/* <Footer /> */}
      </div>
    ) : (
      <Redirect to="/" />
    );
  }
}
const mapStateToProps = state => {
  return {
    userInformation: state.homePage.userInformation,
    notifyMessage: state.editProfile.notifyMessage,
    notifyPasswordMessage: state.changePass.notifyMessage,
    changeMessage: state.changePass.changeMessage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserInfor: () => {
      dispatch(HomePageTypes.getInforRequest());
    },
    editUserProfile: data => {
      dispatch(EditTypes.editRequest(data));
    },
    changePass: data => {
      dispatch(ChangePassTypes.changeRequest(data));
    },
    changeAvatar: data => {
      dispatch(EditTypes.uploadRequest(data));
    },
    updateNotify: () => {
      dispatch(EditTypes.updateNotify());
    }
  };
};

const ChangePasswordScreen = Form.create()(ChangePassword);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordScreen);
