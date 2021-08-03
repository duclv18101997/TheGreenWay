import React, { Component } from "react";
import "../css/related-product.css";
import { Button, Radio, Input, Select, Avatar } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import IntroProductTypes from "../redux/get-intro-product-redux";
import ConvensionTypes from "../redux/paper-conversion-redux";

class SearchComponent extends Component {
  state = {
    size: "default",
    textName: "",
    maxP: "",
    minP: "",
    checkData: true,
    textSearch: ""
  };

  handleSizeChange = e => {
    this.props.resetData();

    this.setState({
      size: e.target.value,
      textName: "",
      maxP: "",
      minP: "",
      // checkData: true,
      textSearch: ""
    });
  };

  onClick = () => {
    const { textSearch, maxP, minP } = this.state;
    const { onSearchHigh } = this.props;
    if (textSearch === undefined) {
      this.setState({
        textSearch: ""
      });
    }
    onSearchHigh({
      textName: textSearch || "",
      maxP,
      minP
    });
  };

  handleChange = value => {
    if (value === undefined) {
      this.setState({
        textSearch: value,
        checkData: true
      });
    } else {
      this.setState({
        textSearch: value,
        checkData: false
      });
    }
  };

  render() {
    const { Search } = Input;
    const { Option } = Select;
    const { size, checkData, textSearch } = this.state;
    const { onSearchFullText, listProductSearch } = this.props;
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          {size === "default" ? (
            <Search
              allowClear
              style={{ width: "50%" }}
              placeholder="Nhập từ khoá cần tìm kiếm ....."
              onSearch={value => this.props.onSearchFullText(value)}
              enterButton
            />
          ) : (
            <div
              style={{
                display: "flex",
                width: "auto",
                height: "100%"
              }}
            >
              <Select
                // Important
                showSearch
                allowClear
                optionFilterProp="children"
                placeholder="Nhập tên sản phẩm ..."
                optionLabelProp="label"
                value={textSearch}
                onFocus={value => {
                  this.setState({
                    checkData: true
                  });
                }}
                onClick={() => {
                  this.setState({
                    checkData: true
                  });
                }}
                onSearch={value => {
                  if (checkData) {
                    this.setState({
                      textSearch: value
                    });
                  }
                }}
                onSelect={value => {
                  this.setState({
                    checkData: true
                  });
                }}
                onChange={this.handleChange}
                filterOption={(input, option) => {
                  if (option.key === "0") {
                    return 1;
                  }
                  return (
                    option.props.children[1].props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
                style={{ width: "500px" }}
              >
                <Option
                  key={0}
                  value={textSearch}
                  label={textSearch}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar
                    shape="square"
                    style={{ marginRight: "10px" }}
                    src={
                      listProductSearch.filter(
                        el => el.ProductName === textSearch
                      ).length > 0
                        ? listProductSearch.find(
                            el => el.ProductName === textSearch
                          ).ImageDetail
                        : "https://firebasestorage.googleapis.com/v0/b/demoweb-2d974.appspot.com/o/images%2Ficons8-package-search-64.png?alt=media&token=d0ac4fb7-699e-480a-8bbc-32eb701a92dd"
                    }
                  />
                  <span>{textSearch}</span>
                </Option>
                {listProductSearch
                  .filter(el => el.ProductName !== textSearch)
                  .map(items => (
                    <Option
                      key={items.ProductID}
                      value={items.ProductName}
                      label={items.ProductName}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Avatar
                        shape="square"
                        src={items.ImageDetail}
                        style={{ marginRight: "10px" }}
                      />
                      <span>{items.ProductName}</span>
                    </Option>
                  ))}
              </Select>
              <Input.Group compact>
                <Select defaultValue="1">
                  <Option value="1"> Giá </Option>
                </Select>
                <Input
                  type="number"
                  allowClear
                  style={{ width: 150, textAlign: "center" }}
                  placeholder="Nhỏ nhất"
                  onChange={event => {
                    this.setState({
                      minP: event.target.value
                    });
                  }}
                />
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: "none"
                  }}
                  placeholder="~"
                  disabled
                />
                <Input
                  allowClear
                  type="number"
                  className="site-input-right"
                  style={{
                    width: 150,
                    textAlign: "center"
                  }}
                  placeholder="Lớn nhất"
                  onChange={event => {
                    this.setState({
                      maxP: event.target.value
                    });
                  }}
                />
              </Input.Group>
              <Button
                type="primary"
                shape="circle"
                icon="search"
                onClick={this.onClick}
              />
            </div>
          )}
          <Radio.Group
            value={size}
            onChange={this.handleSizeChange}
            style={{ marginLeft: "10px" }}
          >
            <Radio.Button value="default">Seach Thông Thường</Radio.Button>
            <Radio.Button value="high">Seach Nâng Cao</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    listProductSearch: state.introProduct.listProductSearch
  };
};

const mapDispatchToProps = dispatch => {
  return {
    searchDefault: params => {
      dispatch(IntroProductTypes.searchDefault(params));
    },
    searchHigh: params => {
      dispatch(IntroProductTypes.searchHigh(params));
    },
    resetData: params => {
      dispatch(IntroProductTypes.resetData());
    }
  };
};

SearchComponent = withRouter(SearchComponent);
export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
