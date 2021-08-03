const jwt = require("jsonwebtoken");

let generateTokenGuest = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const guestData = {
      GuestID: user.GuestID,
      OrderID: user.OrderID,
    };
    // Thực hiện ký và tạo token password: user.password,
    jwt.sign(
      { data: guestData },
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
      }
    );
  });
};

/**
 * This module used for verify jwt token
 */
let verifyTokenGuest = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};
module.exports = {
  generateTokenGuest: generateTokenGuest,
  verifyTokenGuest: verifyTokenGuest,
};
