const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const connectionDB = mysql.createConnection(config.databaseOptions);
var moment = require("moment-timezone");
/**
 * controller user
 */

// get information of user fron database
let getListUser = async (req, res) => {
  // get email from request after handle of authmiddleware
  //Lay thong tin tu database
  const page = req.query.page;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  let sql = `SELECT * FROM Accounts LIMIT ? OFFSET ?`;
  let query = mysql.format(sql, [pageSize, offset]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      const arr = Array.apply(null, result);
      if (arr.length === 0) {
        return res
          .status(200)
          .json({ success: false, message: "Don't exist user !" });
      } else {
        let sql = `SELECT COUNT(*) AS Total FROM Accounts`;
        let query = mysql.format(sql);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            const array = Array.apply(null, results);
            const totalPage = Math.ceil(array[0].Total / pageSize);
            return res.status(200).json({
              success: true,
              data: arr.map((el) => {
                return {
                  ...el,
                  DOB: moment(el.DOB).tz("Asia/Ho_Chi_Minh").format(),
                };
              }),
              totalPage: totalPage,
            });
          }
        });
      }
    }
  });
};

let upRow = async (req, res) => {
  //Lay thong tin tu database
  const email = req.query.email;
  const role = "mod";
  let sql = `UPDATE Accounts SET Accounts.roles=? WHERE Accounts.email=?`;
  let query = mysql.format(sql, [role, email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      return res
        .status(200)
        .json({ success: true, message: "Update User success !" });
    }
  });
};

let downRow = async (req, res) => {
  //Lay thong tin tu database
  const email = req.query.email;
  const role = "user";
  let sql = `UPDATE Accounts SET Accounts.roles=? WHERE Accounts.email=?`;
  let query = mysql.format(sql, [role, email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      return res
        .status(200)
        .json({ success: true, message: "Update User success !" });
    }
  });
};

let lockUser = async (req, res) => {
  //Lay thong tin tu database
  const email = req.query.email;
  const status = "lock";
  let sql = `UPDATE Accounts SET Accounts.status=? WHERE Accounts.email=?`;
  let query = mysql.format(sql, [status, email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      return res
        .status(200)
        .json({ success: true, message: "Lock User success !" });
    }
  });
};

let unlockUser = async (req, res) => {
  //Lay thong tin tu database
  const email = req.query.email;
  const status = "ok";
  let sql = `UPDATE Accounts SET Accounts.status=? WHERE Accounts.email=?`;
  let query = mysql.format(sql, [status, email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      return res
        .status(200)
        .json({ success: true, message: "unLock User success !" });
    }
  });
};

module.exports = {
  getListUser: getListUser,
  downRow: downRow,
  upRow: upRow,
  lockUser: lockUser,
  unlockUser: unlockUser,
};
