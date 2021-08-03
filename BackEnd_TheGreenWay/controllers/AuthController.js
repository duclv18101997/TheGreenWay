const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const nodemailer = require("nodemailer");
const connectionDB = mysql.createConnection(config.databaseOptions);
var moment = require("moment-timezone");
const Cryptr = require("cryptr");
// Biến cục bộ trên server này sẽ lưu trữ tạm danh sách token
// Trong dự án thực tế, nên lưu chỗ khác, có thể lưu vào Redis hoặc DB // luu de con refresherToken
// let tokenList = {};
// Thời gian sống của token
const accessTokenLife = "10h";
const accessTokenLifeReset = "5m";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-cuongnm";
// Regex email, password
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;
const cryptr = new Cryptr("thegreenway");
/**
 * controller login
 */

let register = async (req, res) => {
  debug(req.body);
  // get email,password
  //const username = req.body.username;
  try {
    cryptr.decrypt(req.body.password);
  } catch (e) {
    return res
      .status(200)
      .json({ success: false, message: "Mật khẩu của bạn không đúng" });
  }
  const email = req.body.email;
  const password = cryptr.decrypt(req.body.password);
  // validate email
  if (!emailRegex.test(email)) {
    res.status(200).json({
      success: false,
      message: "Email không đúng định dạng",
    });
  } else if (!passwordRegex.test(password)) {
    // validate password
    res.status(200).json({
      success: false,
      message: "Mật khẩu không đúng định dạng",
    });
    return;
  }
  const passwordString = cryptr.encrypt(password);
  // Tao new empty
  const empty = {
    email: req.body.email,
    password: passwordString,
    username: req.body.username,
    roles: "user",
    urlAvatar:
      "https://firebasestorage.googleapis.com/v0/b/demoweb-2d974.appspot.com/o/images%2Fuser-roles-wordpress.png?alt=media&token=35187642-eb12-4c2c-a415-abd60485112c",
    status: "ok",
  };
  // Luu vao Database
  connectionDB.query("INSERT INTO Accounts SET ?  ", empty, (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Email đã tồn tại" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Đăng kí thành công" });
    }
  });
};

let login = async (req, res) => {
  // check email da ton tai chua
  let sql = `SELECT email, password, roles, status FROM Accounts WHERE email=?`;
  let query = mysql.format(sql, [req.body.email]);
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
          .json({ success: false, message: "Email của bạn không đúng" });
      } else {
        try {
          cryptr.decrypt(req.body.password);
        } catch (e) {
          return res
            .status(200)
            .json({ success: false, message: "Mật khẩu của bạn không đúng" });
        }
        if (
          cryptr.decrypt(arr[0].password) !== cryptr.decrypt(req.body.password)
        ) {
          return res.status(200).json({
            success: false,
            message: "Mật khẩu của bạn không đúng",
          });
        }
        if (arr[0].status === "ok") {
          try {
            const userData = {
              email: arr[0].email,
              roles: arr[0].roles,
            };
            debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
            const accessToken = await jwtHelper.generateToken(
              userData,
              accessTokenSecret,
              accessTokenLife
            );
            debug(`Gửi Token và Refresh Token về cho client...`);
            return res.status(200).json({
              success: true,
              accessToken,
              roles: arr[0].roles,
            });
          } catch (error) {
            return res.status(200).json({
              success: false,
              message: error,
            });
          }
        } else {
          return res.status(200).json({
            success: false,
            message:
              "Tài khoản của bạn đã bị khoá. Liên hệ với admin để khắc phục tình trạng này!",
          });
        }
      }
    }
  });
};

let forgotpassword = async (req, res) => {
  //check email in database
  let sql = `SELECT email, password FROM Accounts WHERE email=?`;
  let query = mysql.format(sql, [req.body.email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // Bao loi trong qua trinh thuc hien query
      return res.status(200).json({ success: false, message: err });
    } else {
      const arr = Array.apply(null, result);
      if (arr.length === 0) {
        // Chua ton tai Email
        return res
          .status(200)
          .json({ success: false, message: "Email không tồn tại" });
      } else {
        // Da ton tai email thi cho tao ma token
        try {
          // tao ma token forgotPassword
          const userData = {
            email: req.body.email,
          };
          const accessToken = await jwtHelper.generateToken(
            userData,
            accessTokenSecret,
            accessTokenLifeReset
          );
          //Tao transporter
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: `nguyencuong.3061997@gmail.com`,
              pass: `manhcuong@vickyrius1997`,
            },
          });
          // tao mailOptions
          const mailOptions = {
            from: "nguyencuong.3061997@gmail.com",
            to: `${req.body.email}`,
            subject: "[TGW] - Tạo lại mật khẩu",
            text:
              "Bạn đang nhận được điều này bởi vì bạn (hoặc người khác) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\n" +
              "Vui lòng nhấp vào liên kết sau hoặc dán liên kết này vào trình duyệt của bạn để hoàn tất quy trình trong vòng 5 phút sau khi nhận được:\n\n" +
              `http://localhost:3000/forgot?${accessToken}?${req.body.email}` +
              "\n\nNếu bạn không yêu cầu điều này, xin vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n",
          };
          // Thao tac Update/Luu vao userToken table
          // Kiem tra email da co trong bang userToken chua
          let sqlForgot = `SELECT email, token FROM AccountsToken WHERE email=?`;
          let queryForgot = mysql.format(sqlForgot, [req.body.email]);
          connectionDB.query(queryForgot, async (err, resultForgot) => {
            if (err) {
              return res.status(200).json({ success: false, message: err });
            } else {
              // check xem da co email trong bang userToken chua
              const arrForgot = Array.apply(null, resultForgot);
              if (arrForgot.length === 0) {
                // Chua co thi tao 1 cai moi
                const empty = { email: req.body.email, token: accessToken };
                connectionDB.query(
                  "INSERT INTO AccountsToken SET ?  ",
                  empty,
                  (err, result) => {
                    if (err) {
                      return res.status(200).json({
                        success: false,
                        message: "Save DB userToken is Faild",
                      });
                    } else {
                    }
                  }
                );
              } else {
                // Da co email trong bang userToken thi update
                let sqlForgot = `UPDATE AccountsToken SET token=? WHERE email=?`;
                let queryForgot = mysql.format(sqlForgot, [
                  accessToken,
                  req.body.email,
                ]);
                connectionDB.query(queryForgot, async (err, resultForgot) => {
                  if (err) {
                    return res.status(200).json({
                      success: false,
                      message: "Update DB userToken is Faild",
                    });
                  } else {
                  }
                });
              }
            }
          });
          // Gui email cho nguoi quen mat khau
          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: err,
              });
            } else {
              return res.status(200).json({
                success: true,
                message: `Chúng tôi sẽ gửi hướng dẫn đến email này nếu liên kết với tài khoản.`,
              });
            }
          });
        } catch (error) {
          res.status(200).json({
            success: false,
            message: error,
          });
        }
      }
    }
  });
};

let resetPassword = async (req, res) => {
  // check email da ton tai chua
  let sql = `SELECT email, token FROM AccountsToken WHERE email=? AND token=?`;
  let query = mysql.format(sql, [req.body.email, req.body.token]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      const arr = Array.apply(null, result);
      if (arr.length === 0) {
        // Khong ton tai email can resetPassword
        return res.status(200).json({
          success: false,
          message: "Tài khoản không cần đặt lại mật khẩu",
        });
      } else {
        // thuc hien ResetPassword
        try {
          cryptr.decrypt(req.body.password);
        } catch (e) {
          return res
            .status(200)
            .json({ success: false, message: "Mật khẩu của bạn không đúng" });
        }
        let sqlForgot = `UPDATE Accounts SET password=? WHERE email=?`;
        let queryForgot = mysql.format(sqlForgot, [
          cryptr.encrypt(cryptr.decrypt(req.body.password)),
          req.body.email,
        ]);
        connectionDB.query(queryForgot, async (err, resultForgot) => {
          if (err) {
            return res.status(200).json({
              success: false,
              message: "Thay đổi mật khẩu không thành công",
            });
          } else {
            //Sau khi update password thi xoa bo luon. Tranh truong hop gui bang postman
            let sqlReset = `DELETE FROM AccountsToken WHERE email=?`;
            let queryReset = mysql.format(sqlReset, [req.body.email]);
            connectionDB.query(queryReset, async (err, resultForgot) => {
              if (err) {
                return res.status(200).json({
                  success: false,
                  message: "Error with reset password",
                });
              } else {
                return res.status(200).json({
                  success: true,
                  message: "Thay đổi mật khẩu thành công",
                });
              }
            });
          }
        });
      }
    }
  });
};

module.exports = {
  login: login,
  register: register,
  forgotpassword: forgotpassword,
  resetPassword: resetPassword,
};
