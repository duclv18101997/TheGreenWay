import React, { Component } from "react";
import { Table, Button, Input, Form, Drawer, Radio, Tooltip } from "antd";
import "../../css/user-infor-list.css";
import "../../css/order-history-detail.css";
import { connect } from "react-redux";
import ModTypes from "../../redux/mod-redux";
import UserOrderHistoryTypes from "../../redux/user-order-history-redux";
import ModalChangeOrderStatus from "./ModalChangeOrderStatus";
import { get } from "lodash";
let moment = require("moment");

class CartInforList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRemove: false,
      visibleDrawerMemberSetting: false,
      idMemberRemove: "",
      keyFilterValue: "",
      keyFilterRole: "all",
      emailChange: "",
      stateTable: "all",
      visibleModalChangeStatusOrder: false,
      orderChange: {},
    };
  }

  componentDidMount() {
    const { getDataOrder } = this.props;
    getDataOrder();
  }

  onOpenDrawerMemberSetting = (item) => {
    const { getOrderDetail } = this.props;
    getOrderDetail(item.OrderID);
    this.setState({
      visibleDrawerMemberSetting: true,
    });
  };

  onCloseDrawerMemberSetting = () => {
    this.setState({
      visibleDrawerMemberSetting: false,
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
        data = data.filter((element) => rg.test(element.OrderID));
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
      callback: (value) => { },
    });
  };

  onOpenModal = (value) => {
    this.setState({
      visibleModalChangeStatusOrder: true,
      orderChange: value,
    });
  };

  onCloseModal = () => {
    this.setState({
      visibleModalChangeStatusOrder: false,
      orderChange: {},
    });
  };

  changOrderStatus = (idOrder, value) => {
    const { changeStatusOrder } = this.props;
    if (value) {
      changeStatusOrder({
        idOrder: idOrder,
        status: value,
        callback: () => {
          this.onCloseModal();
        },
      });
    } else {
      this.onCloseModal();
    }
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
            <span>OrderID</span>
          </div>
        ),
        key: "OrderID",
        render: (text, record) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Tooltip title={record.Description}>
              <div
                style={{
                  width: "5px",
                  height: "33px",
                  marginTop: "2px",
                  marginBottom: "2px",
                  background: `${
                    record.Description === "Đang Chờ Xử Lý"
                      ? "blue"
                      : `${
                      record.Description === "Đang Giao Hàng"
                        ? "yellow"
                        : `${
                        record.Description === "Giao Hàng Thành Công"
                          ? "#10ea10"
                          : `red`
                        }`
                      }`
                    }`,
                  marginRight: "15px",
                }}
              />
            </Tooltip>
            <span>{record.OrderID}</span>
          </div>
        ),
      },
      {
        title: <span>Tổng số tiền</span>,
        dataIndex: "TotalPrice",
        key: "TotalPrice",
        render: (text) => <span>{text ? text.toString().replace(
          /(\d)(?=(\d{3})+(?!\d))/g,
          "$1,"
        ) : ''} VNĐ</span>,
      },
      {
        title: <span>Ngày tạo</span>,
        dataIndex: "CreateDate",
        key: "CreateDate",
        sorter: {
          compare: (a, b) => new Date(a.CreateDate) - new Date(b.CreateDate),
          multiple: 2,
        },
        render: (text) => (
          <span>
            {text !== "Invalid date" ? moment(text).format("DD/MM/YYYY") : `--`}
          </span>
        ),
      },
      {
        title: <span>Ngày giao hàng</span>,
        dataIndex: "EndDate",
        key: "EndDate",
        render: (text) => (
          <span>
            {text !== "Invalid date" ? moment(text).format("DD/MM/YYYY") : `--`}
          </span>
        ),
      },
      {
        title: <span>Địa chỉ giao hàng</span>,
        dataIndex: "ShipAddress",
        key: "ShipAddress",
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
          <div>
            <Button
              icon="info-circle"
              onClick={() => this.onOpenDrawerMemberSetting(record)}
              style={{}}
            />
            <Button
              icon="reconciliation"
              onClick={() => this.onOpenModal(record)}
              style={{ marginLeft: "8px" }}
            />
          </div>
        ),
      },
    ];
    const columnsOrder = [
      {
        title: "Tên Sản Phẩm",
        dataIndex: "ProductName",
        render: (text, record) => (
          <div>
            <img
              style={{ height: "30px", width: "30px", borderRadius: "5px" }}
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
        title: "Tổng số tiền",
        dataIndex: "age",
        render: (text, record) => (
          <div>
            <span>{record.Price ? record.Price.toString().replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            ) : ''} VNĐ</span>
          </div>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "address",
        render: (text, record) => (
          <div>
            <span>{record.QuantityProduct}</span>
          </div>
        ),
      },
    ];
    const {
      visibleRemove,
      visibleDrawerMemberSetting,
      idMemberRemove,
      stateTable,
      visibleModalChangeStatusOrder,
      orderChange,
    } = this.state;
    const { form, listOrder, cartInfor, orderInfor } = this.props;
    const { getFieldDecorator } = form;
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
              <div className="textProjectMember">
                <Radio.Group
                  defaultValue="all"
                  size="large"
                  onChange={(event) => {
                    this.setState({
                      stateTable: event.target.value,
                    });
                  }}
                >
                  <Radio.Button value="all">
                    Tất cả ( {get(listOrder, "length") || ""} )
                  </Radio.Button>
                  <Radio.Button value="Đang Chờ Xử Lý">
                    Đang Xử Lí ({" "}
                    {(
                      (listOrder || []).filter(
                        (el) => el.Description === "Đang Chờ Xử Lý"
                      ) || []
                    ).length || "0"}{" "}
                    )
                  </Radio.Button>
                  <Radio.Button value="Đang Giao Hàng">
                    Đang Giao Hàng ({" "}
                    {(
                      (listOrder || []).filter(
                        (el) => el.Description === "Đang Giao Hàng"
                      ) || []
                    ).length || "0"}{" "}
                    )
                  </Radio.Button>
                  <Radio.Button value="Giao Hàng Thành Công">
                    Đã Thành Công ({" "}
                    {(
                      (listOrder || []).filter(
                        (el) => el.Description === "Giao Hàng Thành Công"
                      ) || []
                    ).length || "0"}{" "}
                    )
                  </Radio.Button>
                  <Radio.Button value="Đơn Hàng Bị Huỷ">
                    Đã Huỷ ({" "}
                    {(
                      (listOrder || []).filter(
                        (el) => el.Description === "Đơn Hàng Bị Huỷ"
                      ) || []
                    ).length || "0"}{" "}
                    )
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
            <div className="divSearh">
              <span style={{ fontSize: "16px" }}>Tìm kiếm đơn hàng</span>
              <div className="FilterName">
                <Input
                  placeholder="Tìm kiếm theo ID"
                  bordered="false"
                  onChange={(event) => {
                    this.setState({
                      keyFilterValue: event.target.value,
                    });
                  }}
                  allowClear
                />
              </div>
            </div>
            <Table
              className="stylesTable"
              columns={columns}
              dataSource={
                stateTable === "all"
                  ? this.getDataTable(
                    (listOrder || []).sort(
                      (a, b) =>
                        new Date(b.CreateDate) - new Date(a.CreateDate)
                    )
                  )
                  : this.getDataTable(
                    (listOrder || [])
                      .filter((el) => el.Description === stateTable)
                      .sort(
                        (a, b) =>
                          new Date(b.CreateDate) - new Date(a.CreateDate)
                      )
                  )
              }
              style={{ background: "white", marginTop: "10px" }}
              // pagination={false}
              pagination={{
                pageSize: 9,
                total: (stateTable === "all"
                  ? this.getDataTable(
                    (listOrder || []).sort(
                      (a, b) =>
                        new Date(b.CreateDate) - new Date(a.CreateDate)
                    )
                  )
                  : this.getDataTable(
                    (listOrder || [])
                      .filter((el) => el.Description === stateTable)
                      .sort(
                        (a, b) =>
                          new Date(b.CreateDate) - new Date(a.CreateDate)
                      )
                  )
                ).length,
              }}
            />
          </div>
        </Form>
        {visibleDrawerMemberSetting ? (
          <Drawer
            title="Basic Drawer"
            placement="right"
            onClose={this.onCloseDrawerMemberSetting}
            visible={visibleDrawerMemberSetting}
            width="50vw"
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
              <div className="order-detail-wrapper-drawer">
                <div className="order-infor-container">
                  <div className="order-infor-left">
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      Thông tin giỏ hàng:
                    </p>
                    <div style={{ display: "flex" }}>
                      <span className="mr-4 order-infor-title">
                        Tổng số tiền:
                      </span>{" "}
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
                      <span>
                        {moment(cartInfor.CreateDate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div style={{ display: "flex" }}>
                      <span className="mr-4 order-infor-title">
                        Ngày nhận hàng:
                      </span>{" "}
                      <span>
                        {moment(cartInfor.EndDate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div style={{ display: "flex" }}>
                      <span className="mr-4 order-infor-title">
                        Ngày chỉnh sửa:
                      </span>{" "}
                      <span>
                        {moment(cartInfor.ModifyDate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="order-infor-right">
                    <Button
                      type="primary"
                      onClick={this.onCloseDrawerMemberSetting}
                    >
                      Quay lại
                    </Button>
                  </div>
                </div>
                <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                  Danh sách sản phẩm:
                </p>
                <Table
                  dataSource={orderInfor}
                  columns={columnsOrder}
                  pagination={false}
                  rowkey="id"
                ></Table>
              </div>
            </div>
          </Drawer>
        ) : null}
        {visibleModalChangeStatusOrder ? (
          <ModalChangeOrderStatus
            visibleModalChangeStatusOrder={visibleModalChangeStatusOrder}
            onCloseModal={this.onCloseModal}
            orderChange={orderChange}
            changOrderStatus={this.changOrderStatus}
          />
        ) : null}
      </div>
    );
  }
}
const CartInforListForm = Form.create()(CartInforList);

const mapStateToProps = (state) => {
  return {
    listOrder: state.modReducers.listOrder || [],
    orderInfor: state.userOrderHistory.orderDetail || {},
    cartInfor: state.userOrderHistory.cartInfor || [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDataOrder: (params) => {
      dispatch(ModTypes.getListOrderRequest(params));
    },
    changeStatusOrder: (params) => {
      dispatch(ModTypes.changeStatusRequest(params));
    },
    getOrderDetail: (params) => {
      dispatch(UserOrderHistoryTypes.getUserOrderDetailIdRequest(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartInforListForm);
