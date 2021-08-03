import React, { Component } from "react";
import "../css/lock-account.css";
import NavBar from "../components/NavBar";

class LockAccount extends Component {
  render() {
    return (
      <div className="lock-wrapper">
        <NavBar />
        <div className="not-found">
          <div className="txt1">Tài khoản của bạn đã bị khóa</div>
          <div className="txt2">
            Vui lòng liên hệ với admin để khắc phục tình trạng này
          </div>
          <div id="orbit-system">
            <div className="system">
              <div className="planet">
                <img
                  src="http://orig02.deviantart.net/69ab/f/2013/106/0/4/sad_man_by_agiq-d61wk0d.png"
                  height="200px"
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LockAccount;
