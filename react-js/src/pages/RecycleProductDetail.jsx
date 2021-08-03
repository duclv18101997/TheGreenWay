import React, { Component } from "react";
import "../css/product-list.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import RecycleProductDetailList from "../components/RecycleProductDetailList";
class RecycleProductDetail extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="product-wrapper" >
          <div className="plant-container">
            <div className="plant-intro" style={{marginBottom:"50px"}}>
              <div>
                <img
                  className="recycle-img"
                  src={require("../images/reuse.png")}
                />
              </div>
              <div className="intro-left">
                <p className="title">Sản phẩm thân thiện với môi trường</p>
                <p className="content">
                  Trồng, sử dụng cây xanh, sử dụng các dụng cụ, đồ dùng tái chế
                  là những việc làm thiết thực nhất để hiện thực hóa những hành
                  động giúp môi trường của chúng ta ngày càng trở nên tốt hơn.
                </p>
              </div>
            </div>
            <RecycleProductDetailList />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default RecycleProductDetail;
