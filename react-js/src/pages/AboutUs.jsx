import React, { Component } from "react";
import "../css/about-us.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CountUp from "react-countup";
import { connect } from "react-redux";
import TeamMember from "../components/TeamMember";
import OrderCartTypes from "../redux/order-card-redux";

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getInforAboutNumber();
  }

  render() {
    const { isHover } = this.state;
    const { numberInfor } = this.props;
    // console.log(numberInfor);
    return (
      <div children="about-us">
        <NavBar />
        <div className="main-content">
          <div
            className="main-introduce "
            data-aos="fade-up"
            data-aos-duration="2000"
            data-aos-anchor-placement="top-center"
          >
            <p className="introduce-title">THE GREEN WAY</p>
            <a
              className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
              href="#teammember"
              style={{ marginTop: "50px" }}
            >
              Về chúng tôi
            </a>
          </div>
        </div>
        <div className="our-mission">
          <div className="plant-office">
            <div className="content-introduce">
              <div data-aos="fade-right" data-aos-duration="1500">
                <h3>Cây để bàn, văn phòng</h3>
                <p>
                  Lựa chọn cây văn phòng , cây để bàn là một trong những sản
                  phẩm của website , đội ngũ chúng tôi muốn hướng các bạn đến
                  một không gian làm việc nơi văn phòng trong lành nhất,loại bọ
                  bụi bẩn, nấm mốc,giúp bạn hạn chế tác hại của tia phóng xạ
                  phát ra từ những thiết bị điện tử..Đây chắc chắn là sự lựa
                  chọn không thể thiếu của dân văn phòng
                </p>
              </div>
            </div>
            <div data-aos="fade-left">
              <img
                className="fade-image"
                src={require("../images/about-us-2.jpg")}
              />
            </div>
          </div>
          <div className="plant-office">
            <div data-aos="fade-right">
              <img
                className="fade-image"
                src={require("../images/about-us-3.jpg")}
              />
            </div>
            <div
              className="content-introduce"
              data-aos="fade-left"
              data-aos-duration="1500"
            >
              <h3>Đồ dùng, sản phẩm thân thiện với môi trường</h3>
              <p>
                Một trong những giải pháp bảo vệ môi trường gần đây được rất
                nhiều người tham gia, hưởng ứng đó chính là sử dụng các vật dụng
                thân thiện với môi trường , góp phần tiết kiệm chi phí , giảm
                thiểu rác thải. Nói một cách khác , đây là lối sống bền vững ,
                hạn chế đến mức tối đa việc sử dụng các tài nguyên thiên nhiên
                để phục vụ nhu cầu cá nhân, đồng thời đảm bảo có thể bù vào
                những nguồn tài nguyên mình vừa sử dụng
              </p>
            </div>
          </div>
          <div className="plant-office">
            <div className="content-introduce">
              <div data-aos="fade-right" data-aos-duration="1500">
                <h3>Chia sẻ kiến thức về bảo vệ môi trường</h3>
                <p>
                  Đây được xem là một trong những nét khác biệt của website
                  chúng tôi so với những website có cùng chức năng khác, đó là
                  chuyên mục tổng hợp các bài đăng hướng dẫn mọi người tạo lối
                  sống xanh cho riêng mình, chia sẻ những thông tin , kiến thức
                  cần thiết để bảo vệ môi trường .
                </p>
              </div>
            </div>
            <div data-aos="fade-left">
              <img
                className="fade-image"
                src={require("../images/about-us-5.jpg")}
              />
            </div>
          </div>
        </div>
        <div className="counter-wrapper">
          <div
            className="counter-number-container"
            onMouseEnter={(event) => this.setState({ isHover: true })}
          >
            <section className=" page-section" id="team">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 text-center">
                    <h2 className="counter-title" style={{ margin: "5% 0%" }}>
                      Thành quả đã đạt được của chúng tôi
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-sm-4"
                    data-aos="fade-right"
                    data-aos-duration="8000"
                  >
                    <div className="team-member">
                      <img
                        style={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                          borderColor: "#d1d1d1",
                        }}
                        src={require("../images/about-us-4.jpg")}
                        alt=""
                      />
                      <h4 className="counter-title">Sản phẩm đã bán</h4>
                      <p className="counter-number">
                        {isHover ? (
                          <CountUp
                            start={0}
                            end={numberInfor.numberProduct || 0}
                            duration={3}
                          />
                        ) : (
                          <CountUp
                            start={numberInfor.numberProduct || 0}
                            end={numberInfor.numberProduct || 0}
                          />
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className="col-sm-4"
                    data-aos="fade-up"
                    data-aos-duration="5000"
                  >
                    <div className="team-member">
                      <img
                        style={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                          borderColor: "#d1d1d1",
                        }}
                        src={require("../images/about-us-6.jpg")}
                        alt=""
                      />
                      <h4 className="counter-title">Số kg giấy thu được</h4>
                      <p className="counter-number">
                        {isHover ? (
                          <CountUp
                            start={0}
                            end={numberInfor.numberPaper || 0}
                            duration={3}
                          />
                        ) : (
                          <CountUp
                            start={numberInfor.numberPaper || 0}
                            end={numberInfor.numberPaper || 0}
                          />
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className="col-sm-4"
                    data-aos="fade-left"
                    data-aos-duration="8000"
                  >
                    <div className="team-member">
                      <img
                        style={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "50%",
                          borderColor: "#d1d1d1",
                        }}
                        src={require("../images/about-us-5.jpg")}
                        alt=""
                      />
                      <h4 className="counter-title">Số bài viết đã chia sẻ</h4>
                      <p className="counter-number">
                        {isHover ? (
                          <CountUp
                            start={0}
                            end={numberInfor.numberPosts || 0}
                            duration={3}
                          />
                        ) : (
                          <CountUp
                            start={numberInfor.numberPosts || 0}
                            end={numberInfor.numberPosts || 0}
                          />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <TeamMember />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    numberInfor: state.orderCart.inforAbout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getInforAboutNumber: () => {
      dispatch(OrderCartTypes.getInforNumberRequest());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AboutUs);
