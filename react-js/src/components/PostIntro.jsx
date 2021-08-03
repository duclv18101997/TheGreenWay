import React, { Component } from 'react';
import { connect } from "react-redux";
import LifeWayTypes from "../redux/life-way-redux";
import { withRouter } from "react-router";

var moment = require("moment");
class PostIntro extends Component {

  componentDidMount() {
    const params = {
      page: 1
    };
    this.props.getPostList(params);
  }

  toPostDetail = id => {
    this.props.history.push(`/life-way-detail/${id}`);
  };

  toLifeWayPage = () => {
    this.props.history.push('/life-way')
  }

  render() {
    const { listPost } = this.props
    return (
      <div>
        <div style={{ backgroundColor: "#E0FFFF" }}>
          <section className="page-section" id="about">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h2 className="section-heading text-uppercase">Cách Sống</h2>
                  <h4 style={{ fontWeight: "normal", fontStyle: "italic", marginBottom: "50px" }}>
                    Hãy cùng xem những cách sống nào giúp thay đổi môi trường
                    của chúng ta!
                </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <ul className="timeline">
                    {listPost ? (
                      listPost.map((item, index) => {
                        if (index < 4) {
                          return (
                            <li className={index % 2 != 0 ? 'timeline-inverted' : ''} key={index}>
                              <div className="timeline-image">
                                <img
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%"
                                  }}
                                  src={item.ImageDetail}
                                  alt=""
                                />
                              </div>
                              <div className="timeline-panel">
                                <div className="timeline-heading">
                                  <h4>{moment(item.CreateDate).format("DD/MM/YYYY")}</h4>
                                  <h4 className="subheading" style={{ cursor: "pointer" }} onClick={() => this.toPostDetail((item || {}).PostID)}>{item.Title}</h4>
                                </div>
                                <div className="timeline-body">
                                  <p className="text-muted" dangerouslySetInnerHTML={{ __html: item.Content }} />
                                  <span className="text-see-more"
                                    onClick={() => this.toPostDetail((item || {}).PostID)}
                                  >...Xem thêm</span>
                                </div>
                              </div>
                            </li>
                          )
                        }
                      })
                    ) : (
                        <div></div>
                      )}
                    <li className="timeline-inverted">
                      <div className="timeline-image">
                        <h4 style={{ cursor: "pointer" }} onClick={this.toLifeWayPage}>Xem thêm</h4>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    listPost: state.lifeWay.postInfor,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPostList: (params) => {
      dispatch(LifeWayTypes.getLifeWayRequest(params));
    },
  };
};
PostIntro = withRouter(PostIntro)
export default connect(mapStateToProps, mapDispatchToProps)(PostIntro);