import React, { Component } from "react";
import "../../css/admin-product-infor.css";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Upload,
  Icon,
  message,
  Modal,
  Select,
  Row,
  Col,
  Table,
  Spin,
} from "antd";
import { connect } from "react-redux";
import AdminProductTypes from "../../redux/admin-product-redux";
import CKEditor from "ckeditor4-react";
import { storage } from "../../firebase";
import { get } from "lodash";

const { Option } = Select;

function getBase64Avatar(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class ProductInforList extends Component {
  state = {
    visible: false,
    loading: false,
    previewVisible: false,
    previewImage: "",
    fileList: [],
    productId: "",
    valueDes: null,
    stateLoading: false,
    stateDetailLoading: false,
    stateAddLoading: false,
    removeArr: [],
  };

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64Avatar(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };

  handleImageDetailChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  //image detail
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleCategoryChange(value) { }

  componentDidMount() {
    this.props.getProductList();
  }

  handleModalCancel = (e) => {
    this.setState({
      visible: false,
      removeArr: [],
      valueDes: null,
    });
  };

  viewProductDetail = (id) => {
    this.props.form.resetFields();
    this.setState({
      productId: id,
    });
    const params = {
      idProduct: id,
      callback: () => {
        this.setState({
          visible: true,
        });
      },
    };
    this.props.getProductDetail(params);
  };

  updateProductInfor = () => {
    window.scrollTo(0, 0);
    const { valueDes } = this.state;
    if (this.props.productDetail.ImageDetail === "") {
      message.error("Vui lòng chọn ảnh đại diện sản phẩm", 2);
    } else if (this.props.imageDetail.length !== 4) {
      message.error(
        `Vui lòng chọn thêm ${
        4 - this.props.imageDetail.length
        } ảnh chi tiết sản phẩm !`,
        2
      );
    } else if (valueDes === "") {
      message.error("Vui lòng nhập mô tả sản phẩm", 2);
    } else if (valueDes === null) {
      this.props.form.validateFieldsAndScroll(
        ["productName", "productPrice", "productQuantity", "category"],
        (err, values) => {
          if (!err) {
            this.setState({
              visible: false,
              stateAddLoading: true,
            });
            setTimeout(() => {
              this.props.updateProduct({
                params: {
                  idProduct: this.state.productId,
                  CategoryID: values.category,
                  ProductName: values.productName,
                  ProductPrice: values.productPrice,
                  Description: this.props.productDetail.Description,
                  Quantity: values.productQuantity,
                  ImageDetail: this.props.productDetail.ImageDetail,
                  CreateDate: this.props.productDetail.CreateDate,
                },
                callback: () => {
                  this.props.form.resetFields();
                  this.setState({
                    stateAddLoading: false,
                  });
                },
              });
            }, 1000);
          }
        }
      );
    } else {
      var re = /\<\p\>\&nbsp\;\<\/\p\>/g;
      let s = this.state.valueDes;
      var myArray = this.state.valueDes.match(re);
      if (myArray) {
        for (let i = 0; i < myArray.length; i++) {
          s = s.replace("<p>&nbsp;</p>", "");
        }
      }
      var re2 = /<p>(&nbsp;)+<\/p>+/g;
      let s2 = s.replace(/ /g, "");
      var myArray2 = s.replace(/ /g, "").match(re2);
      // console.log(myArray2);
      if (myArray2) {
        for (let i = 0; i < myArray2.length; i++) {
          s2 = s2.replace(re2, "");
        }
      }
      // console.log(s2);
      var re1 = /\w+/g;
      var myArray = s2.match(re1);
      // console.log(myArray);
      if (myArray) {
        // console.log("La Chu");

        this.props.form.validateFieldsAndScroll(
          ["productName", "productPrice", "productQuantity", "category"],
          (err, values) => {
            if (!err) {
              this.setState({
                visible: false,
                stateAddLoading: true,
              });
              setTimeout(() => {
                this.props.updateProduct({
                  params: {
                    idProduct: this.state.productId,
                    CategoryID: values.category,
                    ProductName: values.productName,
                    ProductPrice: values.productPrice,
                    Description: valueDes,
                    Quantity: values.productQuantity,
                    ImageDetail: this.props.productDetail.ImageDetail,
                    CreateDate: this.props.productDetail.CreateDate,
                  },
                  callback: () => {
                    this.props.form.resetFields();
                    this.setState({
                      stateAddLoading: false,
                      removeArr: [],
                    });
                  },
                });
              }, 1000);
            }
          }
        );
      } else {
        // console.log("không là chữ");
        message.error("Mô tả không được để trống", 2);
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
        lg: { span: 14 },
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 22 },
        md: { span: 22 },
        lg: { span: 22 },
      },
    };
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        render: (text, record) => (
          <div>
            <span>{record.ProductID}</span>
          </div>
        ),
      },
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
        title: "Giá Tiền",
        dataIndex: "age",
        render: (text, record) => (
          <div>
            <span>{record.ProductPrice ? record.ProductPrice.replace(
              /(\d)(?=(\d{3})+(?!\d))/g,
              "$1,"
            ) : ''} VNĐ</span>
          </div>
        ),
      },
      {
        title: "Lượt thích",
        dataIndex: "numLike",
        render: (text, record) => (
          <div>
            <span>{record.NumberOfLikes}</span>
          </div>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        render: (text, record) => (
          <div>
            <span>{record.Quantity}</span>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        render: (text, record) => (
          <div>
            <span>
              {Number(record.Quantity) === 0 ? "Hết Hàng" : "Còn Hàng"}
            </span>
          </div>
        ),
      },
      {
        title: "Tùy chọn",
        dataIndex: "address",
        render: (text, record) => (
          <div>
            <Button
              type="primary"
              className="mr-3"
              onClick={() => {
                this.viewProductDetail(record.ProductID);
              }}
            >
              Chỉnh sửa
            </Button>
          </div>
        ),
      },
    ];
    const uploadAvatarButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadImageDetailButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const antIcon = (
      <Icon type="loading-3-quarters" style={{ fontSize: 60 }} spin />
    );
    const propsUpload = {
      showUploadList: {
        showDownloadIcon: false,
      },
    };
    const {
      imageUrl,
      stateLoading,
      stateDetailLoading,
      stateAddLoading,
    } = this.state;
    const { productList, productDetail, imageDetail } = this.props;
    return (
      <div className="admin-product-wrapper">
        <p className="title">Thông tin sản phẩm</p>
        <div className="admin-product-table">
          <Table
            dataSource={productList}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowkey="id"
          />
        </div>
        {this.state.visible ? (
          <Modal
            visible={this.state.visible}
            onOk={this.updateProductInfor}
            onCancel={this.handleModalCancel}
            okText="Xác nhận"
            cancelText="Hủy bỏ"
            width={"80%"}
          >
            <Row>
              <Form {...formItemLayout}>
                <Col span={13}>
                  <Form.Item label="Tên sản phẩm">
                    {getFieldDecorator("productName", {
                      initialValue: productDetail.ProductName,
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập tên sản phẩm",
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Form.Item label="Giá sản phẩm">
                      {getFieldDecorator("productPrice", {
                        initialValue: productDetail.ProductPrice,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập giá sản phẩm",
                          },
                        ],
                      })(<InputNumber min={0} type="number" />)}
                    </Form.Item>
                    <Form.Item label="Số lượng">
                      {getFieldDecorator("productQuantity", {
                        initialValue: productDetail.Quantity,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập số lượng sản phẩm",
                          },
                        ],
                      })(<InputNumber min={0} type="number" />)}
                    </Form.Item>
                    <Form.Item label="Loại sản phẩm">
                      {getFieldDecorator("category", {
                        initialValue: productDetail.CategoryID,
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập loại sản phẩm",
                          },
                        ],
                      })(
                        <Select
                          {...this.props}
                          style={{ width: 160 }}
                          onChange={this.handleCategoryChange}
                        >
                          <Option value="1">Cây văn phòng</Option>
                          <Option value="2">Đồ tái chế</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </div>
                  <p>
                    <span style={{ color: "red" }}>*</span>Mô tả sản phẩm:
                  </p>
                  <div className="product-editor">
                    <CKEditor
                      data={productDetail.Description}
                      onChange={(evt) => {
                        if (evt.editor.getData() !== "") {
                          this.setState({
                            valueDes: evt.editor.getData(),
                          });
                        } else {
                          this.setState({
                            valueDes: "",
                          });
                          message.error("Vui lòng nhập mô tả sản phẩm", 2);
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col span={11} className="product-avatar-container">
                  <Form.Item label="Ảnh đại diện">
                    {getFieldDecorator("productAvatar", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập tên sản phẩm",
                        },
                      ],
                    })(
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={(file) => {
                          const isJpgOrPng =
                            file.type === "image/jpeg" ||
                            file.type === "image/png";
                          if (isJpgOrPng) {
                            const isLt2M = file.size / 1024 / 1024 < 3;
                            if (!isLt2M) {
                              message.error(
                                "Ảnh phải có kích thước nhỏ hơn 3MB!"
                              );
                            } else {
                              this.setState({
                                stateLoading: true,
                              });
                              const uploadTask = storage
                                .ref(`images/${file.name}`)
                                .put(file);
                              // Set vao state
                              uploadTask.on(
                                "state_changed",
                                (snapshot) => { },
                                (error) => { },
                                () => {
                                  storage
                                    .ref("images")
                                    .child(file.name)
                                    .getDownloadURL()
                                    .then((url) => {
                                      this.props.changeAvatarImage(url);
                                      this.setState({
                                        stateLoading: false,
                                      });
                                    });
                                }
                              );
                            }
                          } else {
                            message.error(
                              "File upload phải có đuôi .jpg hoặc .png"
                            );
                          }
                        }}
                      >
                        {stateLoading ? (
                          <div
                            style={{
                              zIndex: "200",
                              background: "#d9d9d98f",
                              height: productDetail.ImageDetail
                                ? "146px"
                                : "129px",
                              width: productDetail.ImageDetail
                                ? "146px"
                                : "129px",
                              position: "absolute",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "4px",
                              marginTop: productDetail.ImageDetail
                                ? "-9px"
                                : "-43px",
                              marginLeft: "-9px",
                            }}
                          >
                            <Spin indicator={antIcon} />
                          </div>
                        ) : null}
                        {productDetail.ImageDetail ? (
                          <img src={productDetail.ImageDetail} alt="avatar" />
                        ) : (
                            uploadAvatarButton
                          )}
                      </Upload>
                    )}
                  </Form.Item>

                  <Form.Item label="Ảnh chi tiết">
                    {getFieldDecorator("imageDetail", {
                      rules: [
                        {
                          required: true,
                          message: "Vui lòng nhập mô tả sản phẩm",
                        },
                      ],
                    })(
                      <div className="clearfix">
                        <Upload
                          {...propsUpload}
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          listType="picture-card"
                          fileList={(imageDetail || []).map((item) => {
                            return {
                              uid: item.ImageID || "1",
                              name: "image.png",
                              status: "done",
                              url: item.urlImage || "",
                            };
                          })}
                          onPreview={this.handlePreview}
                          onRemove={(file) => {
                            this.setState({
                              removeArr: [...this.state.removeArr, file.uid],
                            });
                            this.props.removeImageLocal(file.uid);
                          }}
                          beforeUpload={(file) => {
                            const isJpgOrPng =
                              file.type === "image/jpeg" ||
                              file.type === "image/png";
                            if (isJpgOrPng) {
                              const isLt2M = file.size / 1024 / 1024 < 3;
                              if (!isLt2M) {
                                message.error(
                                  "Ảnh phải có kích thước nhỏ hơn 3MB!"
                                );
                              } else {
                                //Link Image
                                this.setState({
                                  stateDetailLoading: true,
                                });
                                const uploadTask = storage
                                  .ref(`images/${file.name}`)
                                  .put(file);
                                // Set vao state
                                uploadTask.on(
                                  "state_changed",
                                  (snapshot) => { },
                                  (error) => { },
                                  () => {
                                    storage
                                      .ref("images")
                                      .child(file.name)
                                      .getDownloadURL()
                                      .then((url) => {
                                        this.props.updateDetailImage({
                                          // ProductID: this.props.productDetail
                                          //   .ProductID,
                                          urlImage: url,
                                          idImage: Math.max(
                                            ...this.state.removeArr
                                          ),
                                        });
                                        this.setState({
                                          stateDetailLoading: false,
                                          removeArr: this.state.removeArr.filter(
                                            (el) =>
                                              el !==
                                              Math.max(...this.state.removeArr)
                                          ),
                                        });
                                      });
                                  }
                                );
                              }
                            } else {
                              message.error(
                                "File upload phải có đuôi .jpg hoặc .png"
                              );
                            }
                          }}
                        >
                          {(imageDetail || []).length >= 4 ? null : (
                            <div>
                              {stateDetailLoading ? (
                                <div
                                  style={{
                                    zIndex: "200",
                                    background: "#d9d9d98f",
                                    height: "104px",
                                    width: "104px",
                                    position: "absolute",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "4px",
                                    marginTop: "-31px",
                                    marginLeft: "-9px",
                                  }}
                                >
                                  <Spin indicator={antIcon} />
                                </div>
                              ) : null}
                              {uploadImageDetailButton}
                            </div>
                          )}
                        </Upload>
                        <Modal
                          visible={previewVisible}
                          footer={null}
                          onCancel={this.handleCancel}
                        >
                          <img
                            alt="example"
                            style={{ width: "100%" }}
                            src={previewImage}
                          />
                        </Modal>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Form>
            </Row>
          </Modal>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    productList: state.adminProduct.productList,
    productDetail: state.adminProduct.productDetail,
    imageDetail: state.adminProduct.imageDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeImageLocal: (value) => {
      dispatch(AdminProductTypes.removeImageLocalRequest(value));
    },
    getProductList: () => {
      dispatch(AdminProductTypes.getProductRequest());
    },
    getProductDetail: (params) => {
      dispatch(AdminProductTypes.getProductDetailAdminRequest(params));
    },
    updateProduct: (params) => {
      dispatch(AdminProductTypes.updateProductRequest(params));
    },
    changeAvatarImage: (params) => {
      dispatch(AdminProductTypes.changeAvatarImage(params));
    },
    deleteDetailImage: (params) => {
      dispatch(AdminProductTypes.deleteImageDetailRequest(params));
    },
    addDetailImage: (params) => {
      dispatch(AdminProductTypes.addImageDetailRequest(params));
    },
    updateDetailImage: (params) => {
      dispatch(AdminProductTypes.updateImageDetailRequest(params));
    },
  };
};
const ProductInforListScreen = Form.create()(ProductInforList);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInforListScreen);
