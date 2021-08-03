import React, { Component } from "react";
import SideBar from "../components/SideBar";
// import HeaderComp from "../components/HeaderComp";
import { Layout } from "antd";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Redirect } from "react-router-dom";
import NavBar from "../components/NavBar";
const { Content } = Layout;
class LayoutProfile extends Component {
  render() {
    const token = window.localStorage.getItem("x-access-token");
    return token ? (
      <Layout>
        <SideBar></SideBar>
        <Layout
          className="content-layout-left"
          style={
            this.props.collapsed
              ? {
                  marginLeft: "100px",
                  transition: "all 0.4s",
                  background: "#fff",
                }
              : {
                  marginLeft: "200px",
                  transition: "all 0.4s",
                  background: "#fff",
                }
          }
        >
          <NavBar />
          <Content
            style={{
              height: "100vh",
              background: "#fff",
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    ) : (
      <Redirect to="/" />
    );
  }
}

const mapStateToProps = (state) => ({
  // collapsed: state.sideBar.collapsed
});

export default connect(mapStateToProps, null)(LayoutProfile);
