const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = {
      email: user.email,
      roles:user.roles,
    }
    // Thực hiện ký và tạo token password: user.password,
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256", // Thuat toan ma hoa
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token); // thanh cong
    });
  });
}


/**
 * This module used for verify jwt token
 */
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};