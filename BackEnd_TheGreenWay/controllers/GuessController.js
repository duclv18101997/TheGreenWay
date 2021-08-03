const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const nodemailer = require("nodemailer");
const connectionDB = mysql.createConnection(config.databaseOptions);

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "3650d";
// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "access-token-secret-cuongnm";
// JwtGuest decode Guest
const jwtGuest = require("../helpers/jwt.guest");
var moment = require("moment-timezone");
/**
 * controller guest
 */

//Get Price,Quatity by ProductID From Cart: Phuc vu chuc nang tinh tien va validate so luong san pham trong cart
let addNewOrderByGuest = async (req, res) => {
  // Render guestID
  const day = new Date();
  const guestID =
    day.getFullYear() +
    "-" +
    day.getMonth() +
    "-" +
    day.getDate() +
    "-" +
    day.getMilliseconds() +
    "-" +
    day.getMinutes() +
    "-" +
    day.getHours();
  // Information of Guess
  console.log(guestID);
  const Name = req.body.Name;
  const Phone = req.body.Phone;
  const Email = req.body.Email;
  const PaymentID = req.body.PaymentID;
  const ConversionID = req.body.ConversionID;
  const TotalPrice = req.body.TotalPrice;
  const ShipAddress = req.body.ShipAddress;
  const CreateDate = req.body.CreateDate;
  const QuantityPaper = req.body.QuantityPaper;
  const Cash = req.body.Cash;
  const arrayCart = req.body.cart;
  //SELECT `GuestID`, `Email`, `Phone`, `ShipAddress`, `Name` FROM `Guest` WHERE 1
  const emptyGuess = {
    GuestID: guestID,
    Email: Email,
    Phone: Phone,
    Name: Name,
    ShipAddress: ShipAddress,
  };

  let arrID = arrayCart.map((e) => e.id);
  let sql = `SELECT Products.ProductID, Products.Quantity, Products.ProductName FROM Products WHERE Products.ProductID IN (${arrID.toString()})`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({ success: false, message: err });
    } else {
      const arr = await Array.apply(null, result);
      var checkOrder = true;
      arr.forEach((e, index) => {
        if (e.Quantity >= arrayCart[index].quatityBuy) {
        } else {
          checkOrder = false;
          if (e.Quantity === 0) {
            return res.status(200).json({
              success: false,
              message: `Sản phẩm ${e.ProductName} đã hết hàng!`,
            });
          } else {
            return res.status(200).json({
              success: false,
              message: `${e.ProductName} chỉ còn ${e.Quantity} sản phẩm`,
            });
          }
        }

      });
      if (checkOrder) {
        connectionDB.query(
          "INSERT INTO Guest SET ? ",
          emptyGuess,
          (err, result) => {
            if (err) {
              debug(err);
              return res
                .status(200)
                .json({ success: false, message: "Add Guest is Unsuccess!" });
            } else {
              //Sucess thi bat dau tao Order
              // Insert Into Orders Table
              let sql = `SELECT MAX(Orders.OrderID) AS OrderID FROM Orders`;
              let query = mysql.format(sql);
              connectionDB.query(query, async (err, result) => {
                if (err) {
                  return res
                    .status(200)
                    .json({ success: false, message: err });
                } else {
                  //Lay ID day vao Database cho bang Product
                  const arr = await Array.apply(null, result);
                  debug(Number(arr[0].OrderID));
                  const OrderID = Number(arr[0].OrderID) + 1; // Vi IDProduct là NVARCHAR
                  debug(OrderID);
                  const empty = {
                    OrderID: OrderID,
                    GuestID: guestID,
                    PaymentID: PaymentID,
                    ConversionID: ConversionID,
                    TotalPrice: TotalPrice,
                    ShipAddress: ShipAddress,
                    CreateDate: CreateDate,
                    QuantityPaper: QuantityPaper,
                    Cash: Cash,
                  };
                  // Luu vao Database
                  connectionDB.query(
                    "INSERT INTO Orders SET ? ",
                    empty,
                    (err, result) => {
                      if (err) {
                        debug(err);
                        return res.status(200).json({
                          success: false,
                          message: "Thêm đơn hàng mới không thành công",
                        });
                      } else {
                        // Insert Into OrderDetail Table
                        arrayCart.forEach(function (item, index, arrays) {
                          const emptyOrderDetail = {
                            OrderID: OrderID,
                            ProductID: item.id,
                            QuantityProduct: item.quatityBuy,
                            Price:
                              Number(item.quatityBuy) * Number(item.price),
                          };
                          // Luu vao Database
                          connectionDB.query(
                            "INSERT INTO OrderDetail SET ? ",
                            emptyOrderDetail,
                            (err, result) => {
                              if (err) {
                                debug(err);
                                return res.status(200).json({
                                  success: false,
                                  message:
                                    "Thêm đơn hàng mới không thành công",
                                });
                              } else {
                                //Next sang viec save database voi OrderStatusDetail
                              }
                            }
                          );
                        });
                        //Save database OrderStatusDetail Mac dinh trang thai la dang xu li
                        // Mod email chưa có gì cả ... Chưa có ngừoi click
                        const emptyOrderStatusDetail = {
                          OrderID: OrderID,
                          OrderStatusID: "1",
                          ModifyDate: CreateDate,
                        };
                        // Luu vao Database
                        connectionDB.query(
                          "INSERT INTO OrderStatusDetail SET ? ",
                          emptyOrderStatusDetail,
                          async (err, result) => {
                            if (err) {
                              debug(err);
                              return res.status(200).json({
                                success: false,
                                message: "Thêm đơn hàng mới không thành công",
                              });
                            } else {
                              //Next sang viec save token
                              // return res.status(200).json({success: true,message : "Add New Orders is Success!"});
                              try {
                                const guestData = {
                                  GuestID: guestID,
                                  OrderID: OrderID,
                                };
                                debug(
                                  `Thực hiện tạo mã Token, [thời gian sống 3650 ngày.]`
                                );
                                const accessToken = await jwtGuest.generateTokenGuest(
                                  guestData,
                                  accessTokenSecret,
                                  accessTokenLife
                                );
                                debug(
                                  `Gửi Token và Refresh Token về cho client...`
                                );
                                const emptyGuest = {
                                  GuestID: guestID,
                                  token: accessToken,
                                };

                                //Tao transporter
                                const transporter = nodemailer.createTransport(
                                  {
                                    service: "gmail",
                                    auth: {
                                      user: `nguyencuong.3061997@gmail.com`,
                                      pass: `manhcuong@vickyrius1997`,
                                    },
                                  }
                                );
                                // tao mailOptions
                                const mailOptions = {
                                  from: "nguyencuong.3061997@gmail.com",
                                  to: `${Email}`,
                                  subject: "[TGW] - Đơn hàng của bạn",
                                  text:
                                    "Bạn đang nhận được điều này bởi vì bạn (hoặc người khác) đã yêu cầu đặt hàng bằng email của bạn.\n\n" +
                                    "Vui lòng nhấp vào liên kết sau hoặc dán liên kết này vào trình duyệt của bạn để xem thông tin đơn hàng:\n\n" +
                                    `http://localhost:3000/order-detail/order?token=${accessToken}` +
                                    "\n\nNếu bạn không yêu cầu điều này, xin vui lòng bỏ qua email này.\n",
                                };
                                // Luu vao Database
                                connectionDB.query(
                                  "INSERT INTO GuestToken SET ? ",
                                  emptyGuest,
                                  (err, result) => {
                                    if (err) {
                                      debug(err);
                                      return res.status(200).json({
                                        success: false,
                                        message: "Add Guest is Unsuccess!",
                                      });
                                    } else {
                                    }
                                  }
                                );

                                transporter.sendMail(
                                  mailOptions,
                                  (err, response) => {
                                    if (err) {
                                      return res.status(200).json({
                                        success: false,
                                        message: err,
                                      });
                                    } else {
                                      return res.status(200).json({
                                        success: true,
                                        message:
                                          "Bạn đã đặt hàng thành công!",
                                        accessToken,
                                      });
                                    }
                                  }
                                );
                              } catch (error) {
                                return res.status(200).json({
                                  success: false,
                                  message: error,
                                });
                              }
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        );
      }
    }
  });
  // Luu vao Database
};

// Show Order Detail List Product By ID AND Email
let showOrderByToken = async (req, res) => {
  // Get Email Of User
  const GuestID = req.jwtDecoded.data.GuestID;
  const OrderID = req.jwtDecoded.data.OrderID;
  // Run sql to get orderHistory
  let sql = ` SELECT *
              FROM Orders
              WHERE Orders.OrderID = ?
              AND Orders.GuestID= ? `;
  let query = mysql.format(sql, [OrderID, GuestID]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({ success: false, message: err });
    } else {
      //Lay ID day vao Database cho bang Product
      const arr = await Array.apply(null, result);
      if (arr.length === 0) {
        // Chua co thi like
        return res.status(200).json({
          success: false,
          message: "You can't have access this order!",
        });
      } else {
        let sql = `   SELECT Orders.OrderID,Orders.PaymentID,Orders.TotalPrice,Orders.ShipAddress,Orders.CreateDate,Orders.EndDate,Orders.QuantityPaper,Orders.Cash,OrderStatusDes.Description,OrderStatusDes.ModifyDate
                            FROM Orders
                            JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate
                                    FROM OrderStatus
                                    JOIN OrderStatusDetail
                                    ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
                            ON Orders.OrderID = OrderStatusDes.OrderID
                            WHERE Orders.OrderID= ?`;
        let query = mysql.format(sql, [OrderID]);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            if (array.length === 0) {
              // Chua co thi like
              return res.status(200).json({
                success: false,
                message: "You can't have access this order!",
              });
            } else {
              let sql = `SELECT
                          OrderDetail.OrderID,OrderDetail.ProductID,Products.ProductName,Products.ImageDetail,OrderDetail.QuantityProduct,OrderDetail.Price
                          FROM
                              OrderDetail
                          JOIN
                            Products
                          WHERE
                              Products.ProductID = OrderDetail.ProductID
                          AND
                            OrderDetail.OrderID = ?`;
              let query = mysql.format(sql, [OrderID]);
              connectionDB.query(query, async (err, result) => {
                if (err) {
                  return res.status(200).json({ success: false, message: err });
                } else {
                  //Lay ID day vao Database cho bang Product
                  const arr = await Array.apply(null, result);
                  if (arr.length === 0) {
                    // Chua co thi like
                    return res.status(200).json({
                      success: false,
                      message: "You can't have access this order!",
                    });
                  } else {
                    // return res.status(200).json({
                    //     success: true,
                    //     data: array[0],
                    //     cart : arr,
                    // });
                    let sql = `SELECT * FROM Guest WHERE Guest.GuestID=?`;
                    let query = mysql.format(sql, [GuestID]);
                    connectionDB.query(query, async (err, resul) => {
                      if (err) {
                        return res
                          .status(200)
                          .json({ success: false, message: err });
                      } else {
                        //Lay ID day vao Database cho bang Product
                        const arrGuest = await Array.apply(null, resul);
                        if (arrGuest.length === 0) {
                          // Chua co thi like
                          return res.status(200).json({
                            success: false,
                            message: "You can't have access this order!",
                          });
                        } else {
                          array[0].CreateDate = moment(array[0].CreateDate)
                            .tz("Asia/Ho_Chi_Minh")
                            .format();
                          array[0].EndDate = moment(array[0].EndDate)
                            .tz("Asia/Ho_Chi_Minh")
                            .format();
                          return res.status(200).json({
                            success: true,
                            data: array[0],
                            cart: arr,
                            infoGuest: arrGuest,
                          });
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
};

module.exports = {
  addNewOrderByGuest: addNewOrderByGuest,
  showOrderByToken: showOrderByToken,
};
