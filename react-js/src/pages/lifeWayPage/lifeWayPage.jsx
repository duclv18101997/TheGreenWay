import React, { Component } from "react";
import "../../css/life-way.css";
import { message } from "antd";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Input, Pagination } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import LifeWayTypes from "../../redux/life-way-redux";
import vietnam from "moment/locale/vi";
var moment = require("moment");

class Lifeway extends Component {
  state = {
    current: 1,
    searchText: "",
    checkSearch: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const params = {
      page: 1,
    };
    this.props.getPostInfor(params);
    this.props.getPostLikeMuch();
    this.props.setCheckSearchFalse();
  }

  onChange(date, dateString) {}

  toPostDetail = (id) => {
    this.props.history.push(`/life-way-detail/${id}`);
  };

  onSelectPageChange = (page) => {
    window.scrollTo(600, 600);
    const { searchText } = this.state;
    const { checkSearch } = this.props;
    if (checkSearch) {
      this.setState({
        current: page,
      });
      this.props.setCheckSearchTrue();
      this.props.searchDefaultPost({
        value: searchText,
        page: page,
      });
    } else {
      this.setState({
        current: page,
      });
      const params = {
        page: page,
      };
      this.props.getPostInfor(params);
    }
  };

  handleSearchChange = (event) => {
    this.setState({
      searchText: event.target.value,
    });
  };

  searchPost = (event) => {
    const { searchText } = this.state;
    this.setState({
      current: 1,
    });
    if (searchText) {
      this.props.setCheckSearchTrue();
      this.props.searchDefaultPost({
        value: searchText,
        page: 1,
      });
    } else {
      this.props.setCheckSearchFalse();
      const params = {
        page: 1,
      };
      this.props.getPostInfor(params);
    }
  };

  changeHeart = (event, item) => {
    event.stopPropagation();
    const token = window.localStorage.getItem("x-access-token");
    if (!token) {
      message.error("Vui lòng đăng nhập để thích sản phẩm", 2);
    } else {
      this.props.setDataLikePost({
        method: item.like === "like" ? "unLike" : "like",
        idP: item.PostID,
      });
    }
  };

  render() {
    const { postInfor, totalPage, postLikeMuch, resultSearch } = this.props;
    // console.log((postLikeMuch.Content || '').length)
    return (
      <div>
        <NavBar />
        <div className="life-way-wrapper">
          <div className="post-header">
            <div className="post-header-image">
              <div className="hovereffect">
                <img src={(postLikeMuch || {}).ImageDetail} alt="" />
                <div className="overlayy">
                  <div className="heart-icon">
                    {(postLikeMuch || {}).like === "like" ? (
                      <img
                        onClick={(event) =>
                          this.changeHeart(event, postLikeMuch)
                        }
                        style={{ height: "35px", width: "35px" }}
                        src={require("../../images/svgIcon/like.svg")}
                        alt=""
                      />
                    ) : (
                      <img
                        onClick={(event) =>
                          this.changeHeart(event, postLikeMuch)
                        }
                        style={{ height: "35px", width: "35px" }}
                        src={require("../../images/svgIcon/unLike.svg")}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="post-header-content">
              <div className="post-header-title">
                <span>{(postLikeMuch || {}).Title}</span>
              </div>
              <div className="post-header-descript">
                <span
                  className="post-header-descript-span"
                  dangerouslySetInnerHTML={{
                    __html: (postLikeMuch || {}).Content,
                  }}
                />
                <span
                  className="text-see-more"
                  onClick={() => this.toPostDetail((postLikeMuch || {}).PostID)}
                >
                  ...Xem thêm
                </span>
              </div>
              <div className="post-header-time">
                <img src={require("../../images/clock.png")} alt="" />
                <span className="ml-2">
                  {moment((postLikeMuch || {}).CreateDate).fromNow()}
                </span>
              </div>
              <div className="post-detail-like">
                <span>Lượt thích : </span>
                <span>{(postLikeMuch || {}).NumberOfLikes}</span>
              </div>
              <div
                className="view-detail-btn"
                onClick={() => this.toPostDetail((postLikeMuch || {}).PostID)}
              >
                <span>Xem chi tiết</span>
              </div>
            </div>
          </div>
          <div className="search-post-wrapper">
            <div className="search-post-title">
              <Input
                size="large"
                placeholder="Nhập tên ..."
                onChange={this.handleSearchChange}
                defaultValue={this.state.searchText}
              />
            </div>
            <div className="search-post-button" onClick={this.searchPost}>
              <p>
                <img
                  className="mr-2"
                  src={require("../../images/search.png")}
                  alt=""
                />
                Tìm kiếm
              </p>
            </div>
          </div>
          {resultSearch ? <div>Có {resultSearch} kết quả tìm kiếm</div> : null}
          <div className="post-detail-wrapper">
            {postInfor ? (
              (postInfor || {}).map((item, index) => {
                return (
                  <div className="post-detail-container" key={index}>
                    <div className="post-detail-image">
                      <div className="hovereffect">
                        <img src={item.ImageDetail} alt="" />
                        <div className="overlayy">
                          <div className="heart-icon">
                            {(item || {}).like === "like" ? (
                              <img
                                onClick={(event) =>
                                  this.changeHeart(event, item)
                                }
                                style={{ height: "35px", width: "35px" }}
                                src={require("../../images/svgIcon/like.svg")}
                                alt=""
                              />
                            ) : (
                              <img
                                onClick={(event) =>
                                  this.changeHeart(event, item)
                                }
                                style={{ height: "35px", width: "35px" }}
                                src={require("../../images/svgIcon/unLike.svg")}
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="post-detail-content">
                      <div
                        className="post-detail-title"
                        onClick={() => this.toPostDetail(item.PostID)}
                      >
                        <span>{item.Title}</span>
                      </div>
                      <div className="post-detail-time">
                        <img src={require("../../images/clock.png")} alt="" />
                        <span className="ml-2">
                          {moment(item.CreateDate).fromNow()}
                        </span>
                      </div>
                      <div className="post-detail-descript">
                        <span
                          className="post-detail-descript-span"
                          dangerouslySetInnerHTML={{ __html: item.Content }}
                        />
                        <span
                          className="text-see-more"
                          onClick={() => this.toPostDetail(item.PostID)}
                        >
                          ...Xem thêm
                        </span>
                      </div>
                      <div className="post-detail-like">
                        <span>Lượt thích : </span>
                        <span>{item.NumberOfLikes}</span>
                      </div>
                      <div
                        className="view-detail-btn"
                        onClick={() => this.toPostDetail(item.PostID)}
                      >
                        <span>Xem chi tiết</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
          <Pagination
            current={this.state.current}
            onChange={this.onSelectPageChange}
            total={totalPage * 10}
            style={{ display: "flex", justifyContent: "center" }}
          />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    postInfor: state.lifeWay.postInfor,
    totalPage: state.lifeWay.totalPostPage,
    postDetailInfor: state.lifeWay.postDetailInfor,
    resultSearch: state.lifeWay.resultSearch,
    postLikeMuch: state.lifeWay.postLikeMuch,
    checkSearch: state.lifeWay.checkSearch,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPostInfor: (params) => {
      dispatch(LifeWayTypes.getLifeWayRequest(params));
    },
    getPostDetailInfor: (id) => {
      dispatch(LifeWayTypes.getLifeWayDetailRequest(id));
    },
    getPostLikeMuch: () => {
      dispatch(LifeWayTypes.getPostLikeMuch());
    },
    setDataLikePost: (params) => {
      dispatch(LifeWayTypes.getLifeWayLikeRequest(params));
    },
    searchDefaultPost: (params) => {
      dispatch(LifeWayTypes.getLifeWaySearchRequest(params));
    },
    setCheckSearchTrue: () => {
      dispatch(LifeWayTypes.setCheckSearchTrue());
    },
    setCheckSearchFalse: () => {
      dispatch(LifeWayTypes.setCheckSearchFalse());
    },
  };
};
Lifeway = withRouter(Lifeway);
export default connect(mapStateToProps, mapDispatchToProps)(Lifeway);
