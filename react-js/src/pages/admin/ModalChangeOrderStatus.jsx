import React, { Component } from "react";
import { Modal, Radio, Icon, Tooltip } from "antd";

class ModalChangeOrderStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status1: true,
      status2: false,
      status3: false,
      status4: false,
      value: "",
    };
  }

  componentDidMount() {
    const { orderChange } = this.props;
    switch (orderChange.Description) {
      case "Đang Chờ Xử Lý":
        this.setState({
          status1: true,
          status2: true,
          status3: false,
          status4: true,
          value: 1,
        });
        break;
      case "Đang Giao Hàng":
        this.setState({
          status1: false,
          status2: true,
          status3: true,
          status4: true,
          value: 2,
        });
        break;
      case "Giao Hàng Thành Công":
        this.setState({
          status1: false,
          status2: false,
          status3: true,
          status4: false,
          value: 3,
        });
        break;
      case "Đơn Hàng Bị Huỷ":
        this.setState({
          status1: false,
          status2: false,
          status3: false,
          status4: true,
          value: 4,
        });
        break;
      default:
        break;
    }
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleOk = (e) => {
    const { changOrderStatus, orderChange } = this.props;
    const { value } = this.state;
    if (orderChange.Description === "Đang Chờ Xử Lý" && value === 1) {
      changOrderStatus(null);
      return;
    }
    if (orderChange.Description === "Đang Giao Hàng" && value === 2) {
      changOrderStatus(null);
      return;
    }
    if (orderChange.Description === "Giao Hàng Thành Công" && value === 3) {
      changOrderStatus(null);
      return;
    }
    if (orderChange.Description === "Đơn Hàng Bị Huỷ" && value === 4) {
      changOrderStatus(null);
      return;
    }
    changOrderStatus(orderChange.OrderID, value);
  };

  render() {
    const {
      visibleModalChangeStatusOrder,
      orderChange,
      onCloseModal,
    } = this.props;
    const { value, status1, status2, status3, status4 } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      <Modal
        title={`Đơn hàng #${orderChange.OrderID}`}
        visible={visibleModalChangeStatusOrder}
        onOk={this.handleOk}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
        onCancel={() => onCloseModal()}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          Đơn hàng của bạn đang ở trạng thái : ({" "}
          <span style={{ textDecoration: "underline" }}>
            {orderChange.Description}
          </span>{" "}
          )
          <Tooltip title="Bạn chỉ có thể chuyển đơn hàng sang trạng thái Giao Hàng Thành Công nếu đơn hàng đang ở trạng thái : Đang Chờ Xử Lý !">
            <Icon style={{ marginLeft: "5px" }} type="question-circle" />
          </Tooltip>
        </span>
        <Radio.Group value={value} onChange={this.onChange}>
          <Radio style={radioStyle} value={1} disabled={!status1}>
            Đang Chờ Xử Lí
          </Radio>
          <Radio style={radioStyle} value={2} disabled={!status2}>
            Đang Giao Hàng
          </Radio>
          <Radio style={radioStyle} value={3} disabled={!status3}>
            Đơn Hàng Giao Thành Công
          </Radio>
          <Radio style={radioStyle} value={4} disabled={!status4}>
            Huỷ Đơn Hàng
          </Radio>
        </Radio.Group>
      </Modal>
    );
  }
}

export default ModalChangeOrderStatus;
