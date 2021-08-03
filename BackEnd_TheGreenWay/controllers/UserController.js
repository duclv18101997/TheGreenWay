const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const connectionDB = mysql.createConnection(config.databaseOptions);
var moment = require("moment-timezone");
const Cryptr = require("cryptr");
/**
 * controller user
 */
const cryptr = new Cryptr("thegreenway");
// get information of user fron database
let information = async (req, res) => {
  // get email from request after handle of authmiddleware
  const email = req.jwtDecoded.data.email;
  //Lay thong tin tu database
  let sql = `SELECT * FROM Accounts WHERE email=?`;
  let query = mysql.format(sql, [email]);
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
          .json({ success: false, message: "Email or Password is not exist!" });
      } else {
        try {
          arr[0].DOB = moment(arr[0].DOB).tz("Asia/Ho_Chi_Minh").format();
          return res.status(200).json({
            success: true,
            data: arr[0],
          });
        } catch (error) {
          return res.status(200).json({
            success: false,
            message: error,
          });
        }
      }
    }
  });
};

// save data of user to database not avatar
let saveinformation = async (req, res) => {
  // get email from request after handle of authmiddleware
  const email = req.jwtDecoded.data.email;
  const username = req.body.username;
  const phone = req.body.phone;
  const DOB = req.body.DOB;
  const address = req.body.address;
  const city = req.body.city;
  const country = req.body.country;
  // const urlAvatar = req.body.urlAvatar;
  // const urlAvatar = "https://firebasestorage.googleapis.com/v0/b/demoweb-2d974.appspot.com/o/images%2Fuser-roles-wordpress.png?alt=media&token=35187642-eb12-4c2c-a415-abd60485112c"; // req.body.role
  //
  let sql = `UPDATE Accounts SET username=?,phone=?,DOB=?,address=?,city=?,country=? WHERE email=?`;
  let query = mysql.format(sql, [
    username,
    phone,
    DOB,
    address,
    city,
    country,
    email,
  ]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({
        success: false,
        message: "Save Information Of User Is Failed!",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Save Information Of User Is Success!",
      });
    }
  });
};

// change avatar of user to database
let changeavatar = async (req, res) => {
  // get email from request after handle of authmiddleware
  const email = req.jwtDecoded.data.email;
  const urlAvatar = req.body.urlAvatar;
  //Luu thong tin tu database
  let sql = `UPDATE Accounts SET urlAvatar=? WHERE email=?`;
  let query = mysql.format(sql, [urlAvatar, email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Save Avatar Of User Is Failed!" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Save Avatar Of User Is Success!" });
    }
  });
};

// change password of user
let changepassword = async (req, res) => {
  // get email from request after handle of authmiddleware
  const email = req.jwtDecoded.data.email;
  try {
    cryptr.decrypt(req.body.oldpassword);
    cryptr.decrypt(req.body.newpassword);
  } catch (e) {
    return res.status(200).json({
      success: false,
      message: "Mật khẩu cũ/mới của bạn không đúng định dạng",
    });
  }
  const oldpassword = cryptr.decrypt(req.body.oldpassword);
  const newpassword = cryptr.decrypt(req.body.newpassword);
  //Luu thong tin tu database
  //Lay thong tin tu database
  let sql = `SELECT email,password FROM Accounts WHERE email=?`;
  let query = mysql.format(sql, [email]);
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
          .json({ success: false, message: "Email or Password is not exist!" });
      } else {
        // Neu co email
        if (oldpassword === cryptr.decrypt(arr[0].password)) {
          let sqlChange = `UPDATE Accounts SET password=? WHERE email=?`;
          let queryChange = mysql.format(sqlChange, [
            cryptr.encrypt(newpassword),
            email,
          ]);
          connectionDB.query(queryChange, async (err, result) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "Thay đổi mật khẩu không thành công",
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "Thay đổi mật khẩu thành công",
              });
            }
          });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Mật khẩu cũ không đúng" });
        }
      }
    }
  });
};

//Check lock user
let checkStatusUser = async (req, res) => {
  // get email from request after handle of authmiddleware
  const email = req.jwtDecoded.data.email;
  //Luu thong tin tu database
  let sql = `SELECT status FROM Accounts WHERE email=?`;
  let query = mysql.format(sql, [email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Tài khoản không được sử dụng" });
    } else {
      const arr = Array.apply(null, result);
      if (arr[0].status === "ok") {
        return res
          .status(200)
          .json({ success: true, message: "Tài khoản được sử dụng" });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Tài khoản không được sử dụng" });
      }
    }
  });
};

module.exports = {
  information: information,
  saveinformation: saveinformation,
  changeavatar: changeavatar,
  changepassword: changepassword,
  checkStatusUser: checkStatusUser,
};
