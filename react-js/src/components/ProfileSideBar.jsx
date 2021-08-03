import React, { Component } from 'react'
import { Layout, Menu, Button } from "antd"
import { connect } from "react-redux"
import testImage from "../images/logo.png"
import questionImage from "../images/logo.png"
import { withRouter } from "react-router"

const { Sider } = Layout

class SideBar extends Component {
  render() {
    return (
      <Sider trigger={null} collapsible  style={{ position: 'fixed' }}>
        <div className='sideBar-container'>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[`/${this.props.location.pathname.split('/')[1]}`]} >
            <Menu.Item
              key='/account'
              onClick={() => {
                this.props.history.push('/test')
              }}
            >
              <img src={testImage} alt="aaa" />
              <span>Test</span>
            </Menu.Item>
            <Menu.Item
              key='/changepassword'
              onClick={() => {
                this.props.history.push('/question')
              }}
            >
              <img src={questionImage} alt="aaa" />
              <span>Question</span>
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

SideBar = withRouter(SideBar)

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
