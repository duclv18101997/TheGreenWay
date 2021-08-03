import React, { Component } from "react";
import "./App.css";
import Route from "./router/route";
import { Provider } from "react-redux";
import configureStore from "./redux/index";
// import "lightgallery.js/dist/css/lightgallery.css";
import "antd/dist/antd.css";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();
class App extends Component {
  render() {
    return (
      <div>
        <Provider store={configureStore()}>
          <Route />
        </Provider>
      </div>
    );
  }
}

export default App;
