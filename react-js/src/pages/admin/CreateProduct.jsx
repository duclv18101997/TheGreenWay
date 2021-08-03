import React, { Component } from "react";
import "../../css/create-product.css";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Icon,
  message,
  Modal,
  Select,
  Row,
  Col,
  Spin,
} from "antd";
import { connect } from "react-redux";
import AdminProductTypes from "../../redux/admin-product-redux";
import { withRouter } from "react-router";
import CKEditor from "ckeditor4-react";
import { storage } from "../../firebase";

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

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 3;
  if (!isLt2M) {
    message.error("Ảnh phải có kích thước nhỏ hơn 3MB!");
  }
  return isJpgOrPng && isLt2M;
}

class CreateProduct extends Component {
  state = {
    loading: false,
    previewVisible: false,
    previewImage: "",
    fileList: [],
    data: "",
    avatarUrl: "",
    newProductId: "",
    stateLoading: false,
    stateDetailLoading: false,
    stateAddLoading: false,
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

  handleImageDetailChange = ({ fileList }) => this.setState({ fileList });

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

  handleCategoryChange(value) {}

  onEditorChange = (evt) => {
    this.setState({
      data: evt.editor.getData(),
    });
  };

  toListProduct = () => {
    this.props.parent("productInfor");
  };

  addNewProduct = () => {
    if (this.state.avatarUrl === "") {
      message.error("Vui lòng nhập ảnh đại diện sản phẩm", 2);
    } else if (this.state.fileList.length !== 4) {
      message.error("Vui lòng nhập ảnh chi tiết", 2);
    } else if (this.state.data === "") {
      message.error("Vui lòng nhập mô tả sản phẩm", 2);
    } else {
      var re = /\<\p\>\&nbsp\;\<\/\p\>/g;
      let s = this.state.data;
      var myArray = this.state.data.match(re);
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
        this.props.form.validateFieldsAndScroll(
          ["productName", "productPrice", "productQuantity", "category"],
          (err, values) => {
            if (!err) {
              const params = {
                CategoryID: values.category,
                ProductName: values.productName,
                ProductPrice: values.productPrice,
                Description: this.state.data,
                Quantity: values.productQuantity,
                CreateDate: new Date(),
                ImageDetail: this.state.avatarUrl,
              };
              this.props.addNewProduct({
                params,
                callback: (idProduct) => {
                  this.state.fileList.map((item, index) => {
                    const paramsAddImage = {
                      ProductID: idProduct,
                      urlImage: item.url,
                    };
                    this.props.addNewProductImage(paramsAddImage);
                  });
                  this.toListProduct();
                },
              });
            }
          }
        );
      } else {
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
    const { stateLoading, stateDetailLoading, stateAddLoading } = this.state;

    const antIcon = (
      <Icon type="loading-3-quarters" style={{ fontSize: 60 }} spin />
    );
    return (
      <div className="create-product-wrapper">
        <p className="title">Tạo sản phẩm mới</p>
        <div className="admin-create-form-container">
          <div style={{ width: "100%" }}>
            <Row>
              <Form {...formItemLayout}>
                <Col span={13}>
                  <Form.Item label="Tên sản phẩm">
                    {getFieldDecorator("productName", {
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
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập giá sản phẩm",
                          },
                        ],
                      })(<InputNumber type="number" min={1} />)}
                    </Form.Item>
                    <Form.Item label="Số lượng">
                      {getFieldDecorator("productQuantity", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập số lượng sản phẩm",
                          },
                        ],
                      })(<InputNumber type="number" min={1} />)}
                    </Form.Item>
                    <Form.Item label="Loại sản phẩm" style={{marginRight:"8%"}}>
                      {getFieldDecorator("category", {
                        rules: [
                          {
                            required: true,
                            message: "Vui lòng nhập loại sản phẩm",
                          },
                        ],
                      })(
                        <Select
                          {...this.props}
                          style={{ width: 200 }}
                          onChange={this.handleCategoryChange}
                        >
                          <Option value="1">Cây văn phòng</Option>
                          <Option value="2">Đồ thân thiện môi trường</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </div>
                  <Form.Item label="Mô tả sản phẩm">
                    {getFieldDecorator(
                      "productDescription",
                      {}
                    )(<CKEditor data="" onChange={this.onEditorChange} />)}
                  </Form.Item>
                </Col>
                <Col span={11}>
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
                          //Link Image
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
                                (snapshot) => {},
                                (error) => {},
                                () => {
                                  storage
                                    .ref("images")
                                    .child(file.name)
                                    .getDownloadURL()
                                    .then((url) => {
                                      this.setState({
                                        avatarUrl: url,
                                      });
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
                              height: this.state.avatarUrl ? "146px" : "129px",
                              width: this.state.avatarUrl ? "146px" : "129px",
                              position: "absolute",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "4px",
                              marginTop: this.state.avatarUrl
                                ? "-9px"
                                : "-43px",
                              marginLeft: "-9px",
                            }}
                          >
                            <Spin indicator={antIcon} />
                          </div>
                        ) : null}
                        {this.state.avatarUrl ? (
                          <img src={this.state.avatarUrl} alt="avatar" />
                        ) : (
                          uploadAvatarButton
                        )}
                      </Upload>
                    )}
                  </Form.Item>

                  <Form.Item label="Ảnh chi tiết">
                    {getFieldDecorator(
                      "imageDetail",
                      {}
                    )(
                      <div className="clearfix">
                        <Upload
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={this.handlePreview}
                          onRemove={(file) => {
                            // Xoa => Api XOa => Reducer tm
                            this.setState({
                              fileList: this.state.fileList.filter(
                                (el) => el.uid !== file.uid
                              ),
                            });
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
                                this.setState({
                                  stateDetailLoading: true,
                                });
                                const uploadTask = storage
                                  .ref(`images/${file.name}`)
                                  .put(file);
                                // Set vao state
                                uploadTask.on(
                                  "state_changed",
                                  (snapshot) => {},
                                  (error) => {},
                                  () => {
                                    storage
                                      .ref("images")
                                      .child(file.name)
                                      .getDownloadURL()
                                      .then((url) => {
                                        this.setState({
                                          fileList: [
                                            ...this.state.fileList,
                                            {
                                              uid: this.state.fileList.length,
                                              name: "image.png",
                                              status: "done",
                                              url: url,
                                            },
                                          ],
                                        });
                                        this.setState({
                                          stateDetailLoading: false,
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
                          {this.state.fileList.length >= 4 ? null : (
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
            <Row
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "15px 0px 30px 0px",
              }}
            >
              <Button onClick={this.addNewProduct} type="primary">
                Tạo sản phẩm mới
              </Button>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    idNewProduct: state.adminProduct.idNewProduct,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewProduct: (params) => {
      dispatch(AdminProductTypes.addNewProductRequest(params));
    },
    addNewProductImage: (params) => {
      dispatch(AdminProductTypes.addNewImageDetailRequest(params));
    },
  };
};
CreateProduct = withRouter(CreateProduct);
const CreateProductScreen = Form.create()(CreateProduct);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProductScreen);
