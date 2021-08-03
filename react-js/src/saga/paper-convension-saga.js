import { put, call } from "redux-saga/effects";
import PaperConventionActions from "../redux/paper-conversion-redux";
import { message } from "antd";
import axios from "axios";

const PaperConvensionSagas = {
  *getConvensionRate() {
    try {
      const convensionInfor = yield call(() => {
        return axios.get(`http://localhost:3001/conversion/getListConversion`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      });
      if (!convensionInfor.data.success) {
        yield put(PaperConventionActions.getConvensionRequestFailed(convensionInfor.data));
        message.error(convensionInfor.data.message, 3);
      } else {
        yield put(PaperConventionActions.getConvensionSucceed(convensionInfor.data));
      }
    } catch (error) {
      yield put(PaperConventionActions.getConvensionRequestFailed(error));
    }
  },

  *applyNewRate(action) {
    try {
      const newRate = yield call(() => {
        return axios.put(`http://localhost:3001/conversion/updateConversion?idConversion=${action.data.params.ConversionID}`, action.data.params, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': window.localStorage.getItem("x-access-token"),
          },
        });
      });
      if (!newRate.data.success) {
        yield put(PaperConventionActions.applyNewRateFailed(newRate.data));
        message.error(newRate.data.message, 3);
      } else {
        action.data.callback();
        yield put(PaperConventionActions.applyNewRateSucceed(newRate.data));
        message.success("Cập nhật thành công",3)
      }
    } catch (error) {
      yield put(PaperConventionActions.applyNewRateFailed(error));
    }
  },

  *getConversionDetail(action) {
    try {
      const detail = yield call(() => {
        return axios.get(`http://localhost:3001/conversion/getInfoConversionbyID?idConversion=${action.data}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': window.localStorage.getItem("x-access-token"),
          },
        });
      });
      if (!detail.data.success) {
        yield put(PaperConventionActions.getConvensionDetailFailed(detail.data));
        message.error(detail.data.message, 3);
      } else {
        yield put(PaperConventionActions.getConvensionDetailSucceed(detail.data));
      }
    } catch (error) {
      yield put(PaperConventionActions.getConvensionDetailFailed(error));
    }
  },

  *addNewConversion(action) {
    try {
      const addNew = yield call(() => {
        return axios.post(`http://localhost:3001/conversion/addNewConversion`,action.data.params, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': window.localStorage.getItem("x-access-token"),
          },
        });
      });
      if (!addNew.data.success) {
        yield put(PaperConventionActions.addConvensionFailed(addNew.data));
        message.error(addNew.data.message, 3);
      } else {
        action.data.callback();
        yield put(PaperConventionActions.addConvensionSucceed(addNew.data));
        message.success("Thêm tỉ giá thành công", 3)
      }
    } catch (error) {
      yield put(PaperConventionActions.addConvensionFailed(error));
    }
  },

};

export default PaperConvensionSagas;
