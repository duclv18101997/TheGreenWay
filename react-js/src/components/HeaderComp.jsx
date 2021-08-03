import React, { Component } from 'react'
import { Layout, Icon, Typography} from "antd"
import PostTypes from "../redux/side-bar-redux"
import { connect } from "react-redux"

const { Header } = Layout
const { Title } = Typography

class HeaderComp extends Component {
  render() {
    return (
      <Header>
        <Icon
          className="trigger"
          type='menu'
          onClick={() => {
            this.props.clickSideBar()
          }}
          theme='outlined'
        />
        <div className='title-header'>
          <Title level={2} className='title-header'>Thông tin tài khoản</Title>
        </div>
      </Header>
    )
  }
}

const mapStateToProps = (state) => ({
  collapsed: state.sideBar.collapsed
})

const mapDispatchToProps = (dispatch) => ({
  clickSideBar: () => {
    dispatch(PostTypes.getClickSideBar())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComp)
