import React, { Component } from "react";
import AOS from 'aos';
import { withRouter } from "react-router";
import '../css/home-page-intro.css'
import 'aos/dist/aos.css';
AOS.init();

class Review extends Component {
  toListPlantPage = () => {
    this.props.history.push("/plant-product");
  };

  toListRecyclePage = () => {
    this.props.history.push("/recycle-product");
  };
  render() {
    return (
      <div className="home-intro-wrapper">
        <div className="home-intro-title">
          <p>Sản phẩm chính</p>
        </div>
        <div className="home-intro">
          <div className="home-intro-plant">
            <div className="home-intro-btn">
              <p className="home-intro-plant-title">Sản phẩm thân thiện với môi trường</p>
              <div className="detail-btn" onClick={this.toListRecyclePage}>
                <p>Xem chi tiết</p>
              </div>
            </div>
            <img
              style={{ width: "100%", height: "100%", borderRadius: "10px" }}
              src={require("../images/intro-plant-6.jpg")}
            ></img>
          </div>
          <div className="home-intro-reycle">
            <div className="home-intro-btn">
              <p className="home-intro-plant-title">Cây cảnh để bàn</p>
              <div className="detail-btn" onClick={this.toListPlantPage}>
                <p>Xem chi tiết</p>
              </div>
            </div>
            <img
              style={{ width: "100%", height: "100%", borderRadius: "10px" }}
              src={require("../images/intro-plant-5.jpg")}
            ></img>
          </div>
        </div>
      </div>
    );
  }
}
Review = withRouter(Review)
export default Review;
