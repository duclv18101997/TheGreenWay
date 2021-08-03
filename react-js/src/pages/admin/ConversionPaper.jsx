import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Collapse,
  Select,
  InputNumber,
} from "antd";
import "../../css/conversion-paper.css";
import { connect } from "react-redux";
import ConvensionTypes from "../../redux/paper-conversion-redux";
let moment = require("moment");
const { Panel } = Collapse;
const { Option } = Select;

class ConversionPaper extends Component {
  state = {
    visible: false,
    visibleAddNew: false,
    newRate: "",
    status: "Không Hoạt Động",
  };

  componentDidMount() {
    this.props.getListConversion();
  }

  applyNewRate = (record) => {
    this.props.applyNewRate({
      params: {
        ...record,
        Status: "Đang Hoạt Động",
      },
      callback: () => {
        this.props.getListConversion();
      },
    });
  };

  editCoversion = (id) => {
    this.setState({
      visible: true,
    });
    this.props.getConversionDetail(id);
  };

  updateConversion = (e) => {
    this.props.form.validateFieldsAndScroll(["rate"], (err, values) => {
      if (!err) {
        this.setState({
          visible: false,
        });
        this.props.applyNewRate({
          params: {
            ConversionID: this.props.conversionDetail.ConversionID,
            PaperPrice: values.rate,
            Status: this.props.conversionDetail.Status,
            CreatedAt: this.props.conversionDetail.CreatedAt,
            ModifyDate: new Date(),
          },
          callback: () => {
            this.props.form.resetFields();
            this.props.getListConversion();
          },
        });
      }
    });
  };

  addNewConversion = (e) => {
    this.props.form.validateFieldsAndScroll(
      ["newRate", "status"],
      (err, values) => {
        if (!err) {
          this.setState({
            visibleAddNew: false,
          });
          const params = {
            PaperPrice: values.newRate,
            CreatedAt: new Date(),
            ModifyDate: new Date(),
            Status: values.status,
          };
          this.props.addNewConversion({
            params,
            callback: () => {
              this.props.form.resetFields();
              this.props.getListConversion();
            },
          });
        }
      }
    );
  };

  handleCancel = (e) => {
    this.props.form.resetFields();
    this.setState({
      visible: false,
    });
  };

  handleAddNewCancel = (e) => {
    this.props.form.resetFields();
    this.setState({
      visibleAddNew: false,
    });
  };

  showModalAddNew = () => {
    this.props.form.resetFields();
    this.setState({
      visibleAddNew: true,
    });
  };

  render() {
    const columnsWorking = [
      {
        title: 'ConversionID',
        width: "10%",
        dataIndex: 'conversionId',
        render: (text, record) => (
          <div>
            <span>{record.ConversionID}</span>
          </div>
        ),
      },
      {
        title: 'Tỉ giá/ 1kg',
        width: "18%",
        dataIndex: 'rate',
        render: (text, record) => (
          <div>
            <span>{record.PaperPrice ? record.PaperPrice.toString().replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            ) : ''} VNĐ</span>
          </div>
        ),
      },
      {
        title: 'Trạng thái',
        width: "18%",
        dataIndex: 'status',
        render: (text, record) => (
          <div>
            <Button type="primary">{record.Status}</Button>
          </div>
        ),
      },
      {
        title: 'Ngày tạo',
        width: "18%",
        dataIndex: 'createdDate',
        render: (text, record) => (
          <div>
            <span>{moment(record.CreatedAt).format("DD/MM/YYYY")}</span>
          </div>
        ),
      },
      {
        title: 'Ngày chỉnh sửa',
        width: "18%",
        dataIndex: 'modifyDate',
        render: (text, record) => (
          <div>
            <span>{moment(record.ModifyDate).format("DD/MM/YYYY")}</span>
          </div>
        ),
      },
      {
        title: 'Cập nhật',
        width: "18%",
        dataIndex: 'update',
        render: (text, record) => (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "32px",
                padding: "0 14px",
                background: `${"#1890ff"}`,
                width: "50%",
                color: "white",
                borderRadius: "4px",
                marginRight: "10px",
                cursor: "pointer",
                minWidth: "90px",
              }}
              onClick={() => {
                this.editCoversion(record.ConversionID);
              }}
            >
              <span>Chỉnh sửa</span>
            </div>
          </div>
        ),
      },
    ];

    const columnsNotWorking = [
      {
        title: 'ConversionID',
        width: "10%",
        dataIndex: 'conversionId',
        render: (text, record) => (
          <div>
            <span>{record.ConversionID}</span>
          </div>
        ),
      },
      {
        title: 'Tỉ giá/ 1kg',
        width: "18%",
        dataIndex: 'rate',
        render: (text, record) => (
          <div>
            <span>{record.PaperPrice ? record.PaperPrice.toString().replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            ) : ''} VNĐ</span>
          </div>
        ),
      },
      {
        title: 'Trạng thái',
        width: "18%",
        dataIndex: 'status',
        render: (text, record) => (
          <div>
            <Button type="danger">{record.Status}</Button>
          </div>
        ),
      },
      {
        title: 'Ngày tạo',
        width: "18%",
        dataIndex: 'createdDate',
        render: (text, record) => (
          <div>
            <span>{moment(record.CreatedAt).format("DD/MM/YYYY")}</span>
          </div>
        ),
      },
      {
        title: 'Ngày chỉnh sửa',
        width: "18%",
        dataIndex: 'modifyDate',
        render: (text, record) => (
          <div>
            <span>{moment(record.ModifyDate).format("DD/MM/YYYY")}</span>
          </div>
        ),
      },
      {
        title: 'Cập nhật',
        width: "18%",
        dataIndex: 'update',
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
                height: "32px",
                padding: "0 14px",
                background: `${"#1890ff"}`,
                width: "auto",
                color: "white",
                borderRadius: "4px",
                marginRight: "10px",
                minWidth: "90px",
                cursor: "pointer",
              }}
              onClick={() => {
                this.editCoversion(record.ConversionID);
              }}
            >
              <span>Chỉnh sửa</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "32px",
                padding: "0 14px",
                background: `${"lightgreen"}`,
                width: "auto",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
                minWidth: "90px",
              }}
              onClick={() => {
                this.applyNewRate(record);
              }}
            >
              <span>Áp dụng</span>
            </div>
          </div>
        ),
      },
    ];
    const { listWorking, listNotWorking, conversionDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 23 },
        sm: { span: 23 },
        md: { span: 23 },
        lg: { span: 14 },
      },
    };
    return (
      <div className="conversion-wrapper">
        <div className="title">
          <p>Tỉ giá chuyển đổi: số tiền/ 1kg giấy</p>
          <Button type="primary" onClick={this.showModalAddNew}>
            + Thêm tỉ giá
          </Button>
        </div>
        <Collapse defaultActiveKey={["1"]} expandIconPosition={"right"}>
          <Panel header="Tỉ giá đang áp dụng" key="1">
            <Table
              dataSource={listWorking}
              columns={columnsWorking}
              pagination={false}
            />
          </Panel>
          <Panel header="Tỉ giá không áp dụng" key="2">
            <Table
              dataSource={listNotWorking}
              columns={columnsNotWorking}
              pagination={false}
            />
          </Panel>
        </Collapse>
        <Modal
          title="Chỉnh sửa tỉ giá giấy"
          visible={this.state.visible}
          onOk={this.updateConversion}
          onCancel={this.handleCancel}
          okText="Xác nhận"
          cancelText="Hủy bỏ"
        >
          <Form {...formItemLayout} className="mt-4">
            <Form.Item label="Số tiền/ 1kg giấy">
              {getFieldDecorator("rate", {
                initialValue: conversionDetail.PaperPrice,
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền"
                  }
                ]
              })(<InputNumber type="number" min={1} />)}
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Thêm mới tỉ giá"
          visible={this.state.visibleAddNew}
          onOk={this.addNewConversion}
          onCancel={this.handleAddNewCancel}
        >
          <Form {...formItemLayout} className="mt-4">
            <Form.Item label="Số tiền/ 1kg giấy: ">
              {getFieldDecorator("newRate", {
                initialValue: this.state.newRate,
                rules: [
                  {
                    required: true,
                    message: "Vui lòng nhập số tiền"
                  }
                ]
              })(<InputNumber type="number" min={1} />)}
            </Form.Item>
            <Form.Item label="Trạng Thái: ">
              {getFieldDecorator("status", {
                initialValue: "Không Hoạt Động",
              })(
                <Select style={{ width: 200 }} {...this.props}>
                  <Option value="Đang Hoạt Động">Đang Hoạt Động</Option>
                  <Option value="Không Hoạt Động<">Không Hoạt Động</Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listWorking: state.convension.conversionListWorking,
    listNotWorking: state.convension.conversionListNotWorking,
    conversionDetail: state.convension.conversionDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListConversion: () => {
      dispatch(ConvensionTypes.getConvensionRequest());
    },
    applyNewRate: (params) => {
      dispatch(ConvensionTypes.applyNewRateRequest(params));
    },
    getConversionDetail: (params) => {
      dispatch(ConvensionTypes.getConvensionDetailRequest(params));
    },
    addNewConversion: (params) => {
      dispatch(ConvensionTypes.addConvensionRequest(params));
    },
  };
};
const ConversionPaperScreen = Form.create()(ConversionPaper);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversionPaperScreen);
