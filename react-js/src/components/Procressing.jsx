import React, { Component } from 'react'
import ReactLoading from 'react-loading'

class Processing extends Component {
  render() {
    return (
      <div>
        <ReactLoading
          type={'spin'}
          color={'#f8bf63'}
          height={'65px'}
          width={'65px'}
          className="loading"
        />
        <div className="loadingOverlay"></div>
      </div>
    )
  }
}

export default Processing