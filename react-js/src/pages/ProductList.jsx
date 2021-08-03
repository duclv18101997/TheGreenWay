import React, { Component } from "react";
import "../css/product-list.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PlantProductList from "../components/PlantProductList";
import RecycleProductList from "../components/RecycleProductList";
import { connect } from "react-redux";
import HomePageTypes from "../redux/home-page-redux";

class ProductList extends Component {
  toListPlantPage = () => {
    this.props.history.push("/plant-product");
  };

  toListRecyclePage = () => {
    this.props.history.push("/recycle-product");
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    let numberOfTotal = 0;
    cart.map(e => (numberOfTotal = numberOfTotal + e.quatityBuy));
    this.props.setDataCart(numberOfTotal);
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="product-wrapper">
          <div
            className="product-header"
            data-aos="fade-up"
            data-aos-duration="2000"
          >
            <div className="product-header-left">
              <div>
                <img
                  className="product-image"
                  src={require("../images/product-1.jpg")}
                />
              </div>
            </div>
            <div className="product-header-right">
              <p className="title">Sản phẩm của chúng tôi</p>
              <p className="content">
                The Green Way mang đến cho các bạn một trải nghiệm mới mẻ và đầy
                thú vị , các bạn sẽ được chiêm ngưỡng một thiên đường xanh với
                vô vàn những loại cây cảnh khác nhau phù hợp với mọi không gian
                văn phòng làm việc. Nếu bạn là một người yêu thiên nhiên , chắc
                chắn đây là cơ hội không thể bỏ lỡ. Ngoài ra khi đến thăm The
                Green Way các bạn sẽ được nâng cao tầm hiểu biết với những chia
                sẻ về kĩ năng chăm sóc cây cảnh, những hành động nhỏ nhưng mang
                đến ý nghĩa to lớn trong hành trình giữ gìn và bảo vệ môi trường
                xanh.
              </p>
            </div>
          </div>
          <div className="plant-container">
            <div className="plant-intro">
              <div className="intro-left">
                <p className="title">Cây cảnh, cây để bàn</p>
                <p className="content">
                  Bạn cảm thấy không gian làm việc nơi văn phòng quá quen thuộc
                  đến nỗi nhàm chán, đơn điệu , bạn muốn thay đổi nó bằng một
                  luồng gió mới của thiên nhiên , hãy cùng chúng tôi khám phá
                  thế giới cây cảnh , cây để bàn văn phòng .. để mang về cho
                  mình một sự lựa chọn phù hợp nhất. Cây cảnh không chỉ tạo
                  không gian làm việc thêm tươi mới , tăng cường trao đổi chất
                  làm sạch không khí; mà ở một khía cạnh nào đó , nó còn mang ý
                  nghĩa phong thủy , đem đến tài lộc , may mắn cho người chủ
                  nhân .
                </p>
                <div className="detail-btn" onClick={this.toListPlantPage}>
                  <p>Xem chi tiết</p>
                </div>
              </div>
              <div>
                <img style={{height:"100%"}} src={require("../images/product-a.png")} />
              </div>
            </div>
            <PlantProductList />
          </div>
          <div className="plant-container">
            <div className="plant-intro">
              <div>
                <img
                  className="recycle-img"
                  src={require("../images/reuse.png")}
                />
              </div>
              <div className="intro-left">
                <p className="title">Sản phẩm thân thiện với môi trường</p>
                <p className="content">
                  Tái chế là một trong những hình thức việc làm đơn giản nhưng
                  lại góp phần bảo vệ môi trường làm giảm thiểu lượng lớn rác
                  thải hiện nay. Đến với The Green Way các bạn sẽ có trải nghiệm
                  thú vị với một phương thức thanh toán hoàn toàn mới. Ngoài
                  phương thức thanh toán bằng tiền mặt thông thường ,bây giờ các
                  bạn có thể thanh toán bằng việc trao đổi vật dụng tái chế như
                  giấy tờ , tài liệu đã qua sử dụng để lựa chọn mang về cho mình
                  những cây cảnh yêu thích , làm đẹp không gian văn phòng của
                  bản thân. Còn chần chừ gì mà không bắt tay với The Green Way
                  để góp phần trở thành đại sứ của môi trường xanh ngay nào !
                </p>
                <div className="detail-btn" onClick={this.toListRecyclePage}>
                  <p>Xem chi tiết</p>
                </div>
              </div>
            </div>
            <RecycleProductList />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    setDataCart: param => {
      dispatch(HomePageTypes.updateStateCart(param));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
