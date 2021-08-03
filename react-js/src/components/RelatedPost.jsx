import React, { Component } from "react";
import "../css/related-product.css";
import { withRouter } from "react-router";
import { message } from "antd";
import { connect } from "react-redux";
import LifeWayTypes from "../redux/life-way-redux";

var moment = require("moment");

class RelatedPost extends Component {
  state = {
    heart: false,
    introData: [],
  };

  componentDidMount() {
    const params = {
      idCategory: 1,
      page: 1,
    };
    this.props.getPostInfor(params);
  }

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

  onClickDetailPost = (event, item) => {
    event.stopPropagation();
    this.props.history.push(`/life-way-detail/${item.PostID}`);
    this.props.getPostDetailInfor(item.PostID);
  };

  render() {
    const { postInfor, filterPost } = this.props;
    // console.log(postInfor)
    return (
      <div>
        <div className="related-article">
          {postInfor
            .filter((el) => el.PostID !== Number(filterPost))
            .map((item, index) => {
              if (index < 3) {
                return (
                  <div
                    className="sub-item shadow bg-white rounded"
                    key={index}
                    onClick={(event) => this.onClickDetailPost(event, item)}
                  >
                    <div className="hovereffect">
                      <img src={item.ImageDetail} alt="" />
                      <div className="overlayy">
                        <div className="heart-icon">
                          {(item || {}).like === "like" ? (
                            <img
                              onClick={(event) => this.changeHeart(event, item)}
                              style={{ height: "35px", width: "35px" }}
                              src={require("../images/svgIcon/like.svg")}
                              alt=""
                            />
                          ) : (
                            <img
                              onClick={(event) => this.changeHeart(event, item)}
                              style={{ height: "35px", width: "35px" }}
                              src={require("../images/svgIcon/unLike.svg")}
                              alt=""
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="related-article-sub-title">
                      <span>{item.Title}</span>
                    </div>
                    <div className="related-article-infor">
                      <div className="related-article-time">
                        <img src={require("../images/clock.png")} alt="" />
                        <span className="ml-2">
                          {moment(item.CreateDate).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postInfor: state.lifeWay.postInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPostInfor: (params) => {
      dispatch(LifeWayTypes.getLifeWayRequest(params));
    },
    setDataLikePost: (params) => {
      dispatch(LifeWayTypes.getLifeWayLikeRequest(params));
    },
    getPostDetailInfor: (id) => {
      dispatch(LifeWayTypes.getLifeWayDetailRequest(id));
    },
  };
};

RelatedPost = withRouter(RelatedPost);
export default connect(mapStateToProps, mapDispatchToProps)(RelatedPost);
