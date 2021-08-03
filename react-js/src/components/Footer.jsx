import React, { Component } from "react";
import { withRouter } from "react-router";
import '../css/footer.css'
class Footer extends Component {
  toContactPage = () => {
    this.props.history.push("/about-us");
  };

  toProductPage = () => {
    this.props.history.push("/product");
  };

  toLifeWay = async () => {
    this.props.history.push("/life-way");
  };
  render() {
    return (
      <div>
        <footer className="new_footer_area bg_color">
          <div className="new_footer_top" style={{ marginTop:"20px"}}>
            <h2 style={{textAlign:'center', marginBottom:"50px", color:"#4ab785"}}>The Green Way</h2>
            <hr style={{ marginBottom:"50px"}}/>
            <div className="container">
              <div className="row" style={{display:'flex', justifyContent:"center"}}>
                <div style={{width:"30%"}}>
                  <div className="f_widget company_widget wow fadeInLeft" data-wow-delay="0.2s" style={{ visibility: "visible", animationDelay: "0.2s", animationName: "fadeInLeft" }}>
                    <h3 className="f-title f_600 t_color f_size_18" style={{cursor:"pointer"}} onClick={this.toProductPage}>Sản Phẩm</h3>
                  </div>
                </div>
                <div style={{width:"30%"}}>
                  <div className="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.4s" style={{ visibility: "visible", animationDelay: "0.4s", animationName: "fadeInLeft" }}>
                    <h3 className="f-title f_600 t_color f_size_18" style={{cursor:"pointer"}} onClick={this.toLifeWay}>Cách Sống</h3>
                  </div>
                </div>
                <div style={{width:"30% !important"}}>
                  <div className="f_widget about-widget pl_70 wow fadeInLeft" data-wow-delay="0.6s" style={{ visibility: "visible", animationDelay: "0.6s", animationName: "fadeInLeft" }}>
                    <h3 className="f-title f_600 t_color f_size_18" style={{cursor:"pointer"}} onClick={this.toContactPage}>Liên hệ</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer_bg">
              <div className="footer_bg_one"></div>
              <div className="footer_bg_two"></div>
            </div>
          </div>
          <div className="footer_bottom">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-sm-7">
                  <p className="mb-0 f_400">© The Green Way. 2020 All rights reserved.</p>
                </div>
                <div className="col-lg-6 col-sm-5 text-right">
                  <p>Made by <i className="icon_heart"></i>The Green Way</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
Footer = withRouter(Footer)
export default Footer;
