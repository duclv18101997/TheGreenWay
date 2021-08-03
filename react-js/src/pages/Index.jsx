import React, { Component } from "react";
import Review from "../components/Review";
import { withRouter } from "react-router";
import "antd/dist/antd.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PostIntro from "../components/PostIntro";
class Index extends Component {
  state = {
    email: "",
    index: 0,
    direction: null,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({
      index: selectedIndex,
      direction: e.direction,
    });
  };

  render() {
    return (
      <div className="home-page">
        <NavBar />
        <header className="masthead">
          <div className="container">
            <div className="intro-text">
              <div
                className="intro-heading text-uppercase"
                style={{ color: "#008000" }}
              >
                The Green Way
              </div>
              <div className="intro-lead-in">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingRight: "160px",
                    paddingLeft: "160px",
                  }}
                >
                  <div
                    style={{
                      flex: "1",
                      display: "flex",
                      color: "#000000",
                      fontSize: "28px",
                      fontFamily: "none",
                    }}
                  >
                    Môi trường là khởi nguồn cho mọi sự sống của toàn nhân loại
                    ...
                  </div>
                  <div
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                      fontSize: "28px",
                      color: "#000000",
                      fontFamily: "none",
                    }}
                  >
                    ...Chúng ta hãy cùng nhau chung tay vì một môi trường bền
                    vững.
                  </div>
                </div>
              </div>
              <a
                className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
                href="#services"
                style={{
                  marginTop: "50px",
                }}
              >
                Về chúng tôi
              </a>
            </div>
          </div>
        </header>

        <section className="page-section" id="services">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h2 className="section-heading text-uppercase">
                  Nhiệm vụ của chúng tôi
                </h2>
                <h4
                  style={{
                    fontWeight: "normal",
                    fontStyle: "italic",
                    marginBottom: "50px",
                  }}
                >
                  Hành động nhỏ vì một mục tiêu lớn
                </h4>
              </div>
            </div>
            <div className="row text-center">
              <div className="col-md-4">
                <img
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                  }}
                  src={require("../images/plant-1.jpg")}
                  alt=""
                />
                <h4 className="service-heading">Cây văn phòng</h4>
                <p className="text-muted">
                  Không gian làm việc nơi văn phòng sẽ thực sự mang một diện mạo
                  mới khi được bày trí một vài loại cây xanh . Sử dụng cây xanh
                  trong thiết kế nội thất văn phòng không chỉ giúp thanh lọc
                  không khí, giảm thiếu các chất độc hại từ thiết bị điện tử mà
                  còn giúp tăng khả năng tập trung , kích thích sáng tạo trong
                  công việc.
                </p>
              </div>
              <div className="col-md-4">
                <img
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                  }}
                  src={require("../images/recycle-1.jpg")}
                  alt=""
                />
                <h4 className="service-heading">Đồ thân thiện với môi trường</h4>
                <p className="text-muted">
                  Tái chế là một hành động đơn giản gần gũi mà bất cứ ai cũng
                  đều có thể làm được, việc tái chế chính là tái sử dụng lại
                  những vật liệu đã cũ , không còn sử dụng được nữa nhằm giảm
                  lượng chất thải thải ra môi trường hàng ngày và giải quyết
                  được vắn đề lãng phí tài nguyên hiện nay.
                </p>
              </div>
              <div className="col-md-4">
                <img
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                  }}
                  src={require("../images/plant-3.jpg")}
                  alt=""
                />
                <h4 className="service-heading">Chia sẻ thông tin</h4>
                <p className="text-muted">
                  Ngay từ bây giờ mỗi người dân chúng ta hãy cùng nhau lan tỏa
                  những hành động ý nghĩa , giúp ích gìn giữ và bảo vệ hành tinh
                  xanh “lá phổi của nhân loại”. Hãy cùng The Green Way chúng tôi
                  chung tay tạo nên một thông điệp vàng “Bảo vệ môi trường chính
                  là bảo vệ cuộc sống của bạn”
                </p>
              </div>
            </div>
          </div>
        </section>
        <PostIntro />
        <Review />
        <div style={{ backgroundColor: "#AFEEEE" }}>
          <section className=" page-section" id="team">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h2 className="section-heading text-uppercase">
                    Hãy Cùng Nhau Hành Động
                  </h2>
                  <h4
                    style={{
                      fontWeight: "normal",
                      fontStyle: "italic",
                      marginBottom: "50px",
                    }}
                  >
                    Những người nổi tiếng, họ đang làm gì?
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <div className="team-member">
                    <img
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        borderColor: "black",
                      }}
                      src={require("../images/bill-gates.jpg")}
                      alt=""
                    />
                    <h4>BillGates</h4>
                    <p className="text-muted">
                      Quỹ từ thiện của tỷ phú BillGates kêu gọi bỏ dầu vì môi
                      trường
                    </p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="team-member">
                    <img
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        borderColor: "black",
                      }}
                      src={require("../images/ronaldo.png")}
                      alt=""
                    />
                    <h4>Ronaldo</h4>
                    <p className="text-muted">
                      C. Ronaldo và sao thể thao kêu gọi cứu rừng Amazon
                    </p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="team-member">
                    <img
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        borderColor: "black",
                      }}
                      src={require("../images/obama.jpg")}
                      alt=""
                    />
                    <h4>Obama</h4>
                    <p className="text-muted">
                      Obama kêu gọi giới trẻ Việt Nam hành động vì môi trường
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <p className="large text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut eaque, laboriosam veritatis, quos non quis ad perspiciatis, totam corporis ea, alias ut unde.</p>
              </div>
            </div> */}
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Index);
