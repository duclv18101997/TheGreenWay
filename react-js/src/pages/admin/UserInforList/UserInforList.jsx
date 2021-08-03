import React, { Component } from "react";
import {
  Table,
  Icon,
  Button,
  Modal,
  Avatar,
  Input,
  Form,
  Collapse,
  Drawer,
  Select,
} from "antd";
import "../../../css/user-infor-list.css";
import { connect } from "react-redux";
import ModTypes from "../../../redux/mod-redux";
import { get } from "lodash";
let moment = require("moment");

class UserInforList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRemove: false,
      visibleDrawerMemberSetting: false,
      idMemberRemove: "",
      keyFilterValue: "",
      keyFilterRole: "all",
      emailChange: "",
    };
  }

  componentDidMount() {
    const { getUser } = this.props;
    getUser();
  }

  showModal = (id) => {
    this.setState({
      visibleRemove: true,
      idMemberRemove: id,
    });
  };

  handleCancel = () => {
    this.setState({
      visibleRemove: false,
      idMemberRemove: "",
    });
  };

  onOpenDrawerMemberSetting = (event) => {
    event.preventDefault();
    this.setState({
      visibleDrawerMemberSetting: true,
    });
  };

  onCloseDrawerMemberSetting = () => {
    this.setState({
      visibleDrawerMemberSetting: false,
    });
  };

  saveInfor = () => {
    const { emailChange } = this.state;
    const { upRole } = this.props;
    if (emailChange === "") {
      return;
    }
    upRole({
      email: emailChange,
      callback: () => {
        this.setState({
          emailChange: "",
        });
      },
    });
  };

  getDataTable = (list) => {
    const { keyFilterValue } = this.state;
    let data = [...list];
    let checklist;
    if (keyFilterValue) {
      checklist = keyFilterValue.match(
        /[^\w\s\da-z0-9A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/g
      );
      if (checklist) {
        data = [];
      } else {
        const rg = new RegExp(keyFilterValue, "i");
        data = data.filter(
          (element) => rg.test(element.username) || rg.test(element.email)
        );
      }
    }
    return data;
  };

  onChangeDrawer = (value) => {
    this.setState({
      emailChange: value,
    });
  };

  onDownRole = (value) => {
    const { downRole } = this.props;
    downRole({
      email: value,
      callback: (value) => {},
    });
  };

  lockUser = (value) => {
    const { lockUser } = this.props;
    lockUser({
      email: value,
      callback: (value) => {},
    });
  };

  unLockUser = (value) => {
    const { unlockUser } = this.props;
    unlockUser({
      email: value,
      callback: (value) => {},
    });
  };

  render() {
    const columns = [
      {
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>Tên</span>
          </div>
        ),
        key: "name",
        width: "15%",
        render: (text, record) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar shape="square" src={record.urlAvatar || ``} />
            <span style={{ marginLeft: "8px" }}>{record.username}</span>
          </div>
        ),
      },
      {
        title: <span>Địa chỉ email</span>,
        dataIndex: "email",
        key: "email",
        width: "15%",
      },
      {
        title: <span>Status</span>,
        dataIndex: "status",
        key: "status",
        render: (text, record) => (
          <div>{text === "ok" ? <span>Active</span> : <span>Lock</span>}</div>
        ),
      },
      {
        title: <span>Quyền</span>,
        dataIndex: "roles",
        key: "role",
        width: "10%",
        render: (text, record) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "20px",
                paddingLeft: "5px",
                paddingRight: "5px",
                background: `${
                  record.roles === "admin"
                    ? "#FF4500"
                    : record.roles === "mod"
                    ? "blue"
                    : "#00BFFF"
                }`,
                width: "auto",
                color: "white",
                borderRadius: "5px",
              }}
            >
              <span style={{ textTransform: "uppercase" }}>{text}</span>
            </div>
          </div>
        ),
      },
      {
        title: <span>Ngày sinh</span>,
        dataIndex: "DOB",
        key: "DOB",
        render: (text) => (
          <span>
            {text !== "Invalid date" ? moment(text).format("DD/MM/YYYY") : `--`}
          </span>
        ),
        width: "10%",
      },
      {
        title: <span>Địa chỉ</span>,
        dataIndex: "address",
        key: "address",
        render: (text) => <span>{text !== "" ? text : `--`}</span>,
        width: "25%",
      },
      {
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>Action</span>
          </div>
        ),
        width: "10%",
        key: "action",
        render: (text, record) => (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              icon="info-circle"
              onClick={() => this.showModal(record)}
              // disabled={record.roles === "admin"}
              style={{ border: "none" }}
            />
            {record.roles === "admin" ? null : (
              <div>
                {record.status === "ok" ? (
                  <Button
                    icon="lock"
                    onClick={() => this.lockUser(record.email)}
                    // disabled={record.roles === "admin"}
                    style={{ marginLeft: "8px" }}
                  />
                ) : (
                  <Button
                    icon="unlock"
                    onClick={() => this.unLockUser(record.email)}
                    // disabled={record.roles === "admin"}
                    style={{ marginLeft: "8px" }}
                  />
                )}
              </div>
            )}
          </div>
        ),
      },
    ];
    const columnsAdmin = [
      {
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>Tên</span>
          </div>
        ),
        key: "name",
        render: (text, record) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar shape="square" src={record.urlAvatar || ``} />
            <span style={{ marginLeft: "8px" }}>{record.username}</span>
          </div>
        ),
      },
      {
        title: <span>Địa chỉ email</span>,
        dataIndex: "email",
        key: "email",
      },
      {
        title: <span>Quyền</span>,
        dataIndex: "roles",
        key: "role",
        render: (text, record) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "20px",
                paddingLeft: "5px",
                paddingRight: "5px",
                background: `${
                  record.roles === "admin"
                    ? "#FF4500"
                    : record.roles === "mod"
                    ? "blue"
                    : "#00BFFF"
                }`,
                width: "auto",
                color: "white",
                borderRadius: "5px",
              }}
            >
              <span style={{ textTransform: "uppercase" }}>{text}</span>
            </div>
          </div>
        ),
      },
      {
        title: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>Xóa</span>
          </div>
        ),
        key: "action",
        render: (text, record) => (
          <div>
            <Button
              icon="delete"
              onClick={() => this.onDownRole(record.email)}
              // disabled={record.roles === "admin"}
              style={{ border: "none" }}
            />
          </div>
        ),
      },
    ];
    const {
      visibleRemove,
      visibleDrawerMemberSetting,
      idMemberRemove,
    } = this.state;
    const { form, listUser } = this.props;
    const { getFieldDecorator } = form;
    const { Panel } = Collapse;
    const { Option } = Select;
    return (
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        className="contentComponent"
      >
        <Form>
          <div className="bodyContainer">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span className="textProjectMember">
                The Green Way có {get(listUser, "length")} thành viên
              </span>
            </div>
            <div className="divSearh">
              <span style={{ fontSize: "16px" }}>Tìm kiếm người dùng</span>
              <div className="FilterName">
                <Input
                  placeholder="Tìm kiếm theo tên hoặc địa chỉ email"
                  bordered="false"
                  onChange={(event) => {
                    this.setState({
                      keyFilterValue: event.target.value,
                    });
                  }}
                  allowClear
                />
              </div>
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
                onClick={this.onOpenDrawerMemberSetting}
              >
                Cài đặt người dùng
              </Button>
            </div>
            <Collapse
              defaultActiveKey={["1"]}
              style={{ marginTop: "10px" }}
              expandIconPosition={"right"}
            >
              <Panel
                header={`Tài khoản đang hoạt động (${
                  (listUser || []).filter((el) => el.status === "ok").length
                })`}
                key="1"
              >
                <div>
                  <Table
                    className="stylesTable"
                    columns={columns}
                    dataSource={this.getDataTable([
                      ...(listUser || []).filter(
                        (el) => el.roles === "admin" && el.status === "ok"
                      ),
                      ...(listUser || []).filter(
                        (el) => el.roles === "mod" && el.status === "ok"
                      ),
                      ...(listUser || []).filter(
                        (el) => el.roles === "user" && el.status === "ok"
                      ),
                    ])}
                    style={{ background: "white" }}
                    pagination={false}
                  />
                </div>
              </Panel>
              <Panel
                header={`Tài khoản đang khóa (${
                  (listUser || []).filter((el) => el.status !== "ok").length
                })`}
                key="2"
              >
                <div>
                  <Table
                    className="stylesTable"
                    columns={columns}
                    dataSource={this.getDataTable([
                      ...(listUser || []).filter(
                        (el) => el.roles === "mod" && el.status !== "ok"
                      ),
                      ...(listUser || []).filter(
                        (el) => el.roles === "user" && el.status !== "ok"
                      ),
                    ])}
                    style={{ background: "white" }}
                    pagination={false}
                  />
                </div>
              </Panel>
            </Collapse>
          </div>
        </Form>
        {visibleDrawerMemberSetting ? (
          <Drawer
            title="Basic Drawer"
            placement="right"
            onClose={this.onCloseDrawerMemberSetting}
            visible={visibleDrawerMemberSetting}
            width="40vw"
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "88vh",
                flexDirection: "column",
                alignSelf: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "80px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Select
                  showSearch
                  style={{ width: 500 }}
                  value={this.state.emailChange}
                  placeholder="Select a user"
                  optionFilterProp="children"
                  optionLabelProp="label"
                  onChange={this.onChangeDrawer}
                  filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {(listUser || [])
                    .filter((el) => el.roles === "user" && el.status === "ok")
                    .map((items) => (
                      <Option
                        key={items.email}
                        value={items.email}
                        label={items.email}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          shape="square"
                          src={items.urlAvatar}
                          style={{ marginRight: "10px" }}
                        />
                        <span>{items.username}</span>

                        <span style={{ marginLeft: "20px" }}>
                          | {items.email}
                        </span>
                      </Option>
                    ))}
                </Select>
                <Button
                  style={{ marginLeft: "10px", width: "100px" }}
                  onClick={this.saveInfor}
                >
                  Lưu
                </Button>
              </div>
              <div
                style={{
                  flex: "1",
                  width: "100%",
                  flexDirection: "column",
                  alignSelf: "center",
                }}
              >
                <Table
                  className="stylesTable"
                  columns={columnsAdmin}
                  dataSource={
                    (listUser || []).filter(
                      (el) => el.roles === "mod" && el.status === "ok"
                    ) || []
                  }
                  style={{ background: "white" }}
                  pagination={false}
                />
              </div>
            </div>
          </Drawer>
        ) : null}
        {visibleRemove ? (
          <Modal
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon
                  type="info-circle"
                  style={{
                    color: "blue",
                    marginRight: "5px",
                    fontSize: "15px",
                  }}
                />
                <span>Thông tin người dùng</span>
              </div>
            }
            visible={visibleRemove}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="Hủy bỏ"
            footer={[<Button onClick={this.handleCancel}>Hủy bỏ</Button>]}
            width={345}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div style={{ width: "150px", height: "150px" }}>
                <Avatar
                  shape="square"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                  src={idMemberRemove.urlAvatar}
                />
              </div>
              <span style={{ marginTop: "10px" }}>
                {idMemberRemove.username}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "300px",
                  height: "50px",
                  borderBottom: "1px solid black",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>Email</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>{idMemberRemove.email}</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "300px",
                  height: "50px",
                  borderBottom: "1px solid black",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>Quyền</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>{idMemberRemove.roles}</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "300px",
                  height: "50px",
                  borderBottom: "1px solid black",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>Điện thoại</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>{idMemberRemove.phone}</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "300px",
                  height: "50px",
                  borderBottom: "1px solid black",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>Địa chỉ</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>{idMemberRemove.address}</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "300px",
                  height: "50px",
                  borderBottom: "1px solid black",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>Thành phố</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>{idMemberRemove.city}</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "300px",
                  height: "50px",
                  borderBottom: "1px solid black",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>Quốc gia</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span>{idMemberRemove.country}</span>
                </div>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    );
  }
}
const MemberFrom = Form.create()(UserInforList);

const mapStateToProps = (state) => {
  return {
    listUser: state.modReducers.listUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (params) => {
      dispatch(ModTypes.getUserRequest(params));
    },
    upRole: (params) => {
      dispatch(ModTypes.upRoleRequest(params));
    },
    downRole: (params) => {
      dispatch(ModTypes.downRoleRequest(params));
    },
    lockUser: (params) => {
      dispatch(ModTypes.lockRequest(params));
    },
    unlockUser: (params) => {
      dispatch(ModTypes.unlockRequest(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberFrom);
