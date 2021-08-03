const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const connectionDB = mysql.createConnection(config.databaseOptions);
var moment = require("moment-timezone");
/**
 * controller user
 */

//Get Price,Quatity by ProductID From Cart: Phuc vu chuc nang tinh tien va validate so luong san pham trong cart
let addNewOrderByUser = async (req, res) => {
  // Get Email Of User
  const email = req.jwtDecoded.data.email;
  // Information of Product In Cart
  const arrayCart = req.body.cart;
  // Get More Information Of User
  const PaymentID = req.body.PaymentID;
  const ConversionID = req.body.ConversionID;
  const TotalPrice = req.body.TotalPrice;
  const ShipAddress = req.body.ShipAddress;
  const CreateDate = req.body.CreateDate;
  const QuantityPaper = req.body.QuantityPaper;
  const Cash = req.body.Cash;
  // Insert Into Orders Table
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
        let sql = `SELECT MAX(Orders.OrderID) AS OrderID FROM Orders`;
        let query = mysql.format(sql);
        connectionDB.query(query, async (err, result) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const arr = await Array.apply(null, result);
            const OrderID = Number(arr[0].OrderID) + 1; // Vi IDProduct là NVARCHAR
            const empty = {
              OrderID: OrderID,
              UserEmail: email,
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
                    message: "Thêm đơn hàng mới không thành công!",
                  });
                } else {
                  // Insert Into OrderDetail Table
                  arrayCart.forEach(function (item, index, arrays) {
                    const emptyOrderDetail = {
                      OrderID: OrderID,
                      ProductID: item.id,
                      QuantityProduct: item.quatityBuy,
                      Price: Number(item.quatityBuy) * Number(item.price),
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
                            message: "Thêm đơn hàng mới không thành công!",
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
                    (err, result) => {
                      if (err) {
                        debug(err);
                        return res.status(200).json({
                          success: false,
                          message: "Thêm đơn hàng mới không thành công!",
                        });
                      } else {
                        //Next sang viec save database voi OrderStatusDetail
                        return res.status(200).json({
                          success: true,
                          message: "Thêm đơn hàng mới thành công!",
                        });
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
  });
};

// get information of user fron database
let getInforAbout = async (req, res) => {
  // get email from request after handle of authmiddleware
  let sql = `SELECT
                SUM(a.SUMP) AS SumProduct, SUM(Orders.QuantityPaper) AS QuantityPaper
              FROM
                Orders
              JOIN(
                SELECT
                    OrderDetail.OrderID,
                    SUM(QuantityProduct) AS SUMP
                FROM
                    OrderDetail
                JOIN 
                  OrderStatusDetail
                WHERE 
                  OrderDetail.OrderID = OrderStatusDetail.OrderID
                AND 
                  OrderStatusDetail.OrderStatusID IN (2,3)
                GROUP BY
                    OrderDetail.OrderID
              ) a
              WHERE
                a.OrderID = Orders.OrderID`;
  let query = mysql.format(sql);
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
          .json({ success: false, message: "Error with server !" });
      } else {
        let sql = `SELECT COUNT(PostID) as SumPost FROM Posts`;
        let query = mysql.format(sql);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            const array = Array.apply(null, results);
            return res.status(200).json({
              success: true,
              data: {
                numberProduct: arr[0].SumProduct,
                numberPaper: arr[0].QuantityPaper,
                numberPosts: array[0].SumPost,
              },
            });
          }
        });
      }
    }
  });
};

//Show Order List By Email
//Get Price,Quatity by ProductID From Cart: Phuc vu chuc nang tinh tien va validate so luong san pham trong cart
let showOrderListByEmail = async (req, res) => {
  // Get Email Of User
  const email = req.jwtDecoded.data.email;
  const page = req.query.page;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;
  // Run sql to get orderHistory
  let sql = `SELECT Orders.OrderID,Orders.PaymentID,Orders.TotalPrice,Orders.ShipAddress,Orders.CreateDate,Orders.EndDate,Orders.QuantityPaper,Orders.Cash,OrderStatusDes.Description,OrderStatusDes.ModifyDate
              FROM Orders
              JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate
                    FROM OrderStatus
                    JOIN OrderStatusDetail
                    ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
              ON Orders.OrderID = OrderStatusDes.OrderID
              AND Orders.UserEmail= ?
              ORDER BY Orders.OrderID DESC
              LIMIT ?
              OFFSET ?`;
  let query = mysql.format(sql, [email, pageSize, offset]);
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
          message: "Không có đơn hàng!",
        });
      } else {
        let sql = ` SELECT COUNT(*) AS Total
                            FROM Orders
                            JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate
                                  FROM OrderStatus
                                  JOIN OrderStatusDetail
                                    ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
                            ON Orders.OrderID = OrderStatusDes.OrderID
                            AND Orders.UserEmail= ?`;
        let query = mysql.format(sql, [email]);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            const totalPage = Math.ceil(array[0].Total / pageSize);
            // //Luu vao database
            arr.forEach(function (item, index, arrays) {
              item.CreateDate = moment(item.CreateDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              item.ModifyDate = moment(item.ModifyDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              item.EndDate = moment(item.EndDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
            });
            return res.status(200).json({
              success: true,
              data: arr,
              totalPage: totalPage, // Total page
            });
          }
        });
      }
    }
  });
};

// Show Order Detail List Product By ID AND Email
let showOrderByEmail = async (req, res) => {
  // Get Email Of User
  const email = req.jwtDecoded.data.email;
  const idOrder = req.query.idOrder;
  // Run sql to get orderHistory
  let sql = ` SELECT *
              FROM Orders
              WHERE Orders.OrderID = ?
              AND Orders.UserEmail= ? `;
  let query = mysql.format(sql, [idOrder, email]);
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
          message: "Bạn không có quyền truy cập",
        });
      } else {
        let sql = ` SELECT Orders.OrderID,Orders.PaymentID,Orders.TotalPrice,Orders.ShipAddress,Orders.CreateDate,Orders.EndDate,Orders.QuantityPaper,Orders.Cash,OrderStatusDes.Description,OrderStatusDes.ModifyDate
                    FROM Orders
                    JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate
                          FROM OrderStatus
                          JOIN OrderStatusDetail
                          ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
                    ON Orders.OrderID = OrderStatusDes.OrderID
                    AND Orders.OrderID = ?
                    AND Orders.UserEmail= ?`;
        let query = mysql.format(sql, [idOrder, email]);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            if (array.length === 0) {
              // Chua co thi likex
              return res.status(200).json({
                success: false,
                message: "Bạn không có quyền truy cập",
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
              let queryOrder = mysql.format(sql, [idOrder]);
              connectionDB.query(queryOrder, async (err, resultsOrder) => {
                if (err) {
                  return res.status(200).json({ success: false, message: err });
                } else {
                  //Lay ID day vao Database cho bang Product
                  const arrayOrder = await Array.apply(null, resultsOrder);
                  if (arrayOrder.length === 0) {
                    // Chua co thi likex
                    return res.status(200).json({
                      success: false,
                      message: "Bạn không có quyền truy cập",
                    });
                  } else {
                    return res.status(200).json({
                      success: true,
                      data: array[0],
                      cart: arrayOrder,
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

//Show order by ID
let showOrderByID = async (req, res) => {
  // Get Email Of User
  const idOrder = req.query.idOrder;
  // Run sql to get orderHistory
  let sql = ` SELECT Orders.OrderID,Orders.PaymentID,Orders.TotalPrice,Orders.ShipAddress,Orders.CreateDate,Orders.EndDate,Orders.QuantityPaper,Orders.Cash,OrderStatusDes.Description,OrderStatusDes.ModifyDate
                    FROM Orders
                    JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate
                          FROM OrderStatus
                          JOIN OrderStatusDetail
                          ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
                    ON Orders.OrderID = OrderStatusDes.OrderID
                    AND Orders.OrderID = ?`;
  let query = mysql.format(sql, [idOrder]);
  connectionDB.query(query, async (err, results) => {
    if (err) {
      return res.status(200).json({ success: false, message: err });
    } else {
      //Lay ID day vao Database cho bang Product
      const array = await Array.apply(null, results);
      if (array.length === 0) {
        // Chua co thi likex
        return res.status(200).json({
          success: false,
          message: "Bạn không có quyền truy cập",
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
        let queryOrder = mysql.format(sql, [idOrder]);
        connectionDB.query(queryOrder, async (err, resultsOrder) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const arrayOrder = await Array.apply(null, resultsOrder);
            if (arrayOrder.length === 0) {
              // Chua co thi likex
              return res.status(200).json({
                success: false,
                message: "Bạn không có quyền truy cập",
              });
            } else {
              return res.status(200).json({
                success: true,
                data: array[0],
                cart: arrayOrder,
              });
            }
          }
        });
      }
    }
  });
};

//Show List Order for MOD
let showOrderListForMOD = async (req, res) => {
  // Get Email Of User
  // Run sql to get orderHistory
  let sql = `SELECT Orders.OrderID,Orders.PaymentID,Orders.TotalPrice,Orders.ShipAddress,Orders.CreateDate,Orders.EndDate,Orders.QuantityPaper,Orders.Cash,OrderStatusDes.Description,OrderStatusDes.ModifyDate
              FROM Orders
              JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate
                    FROM OrderStatus
                    JOIN OrderStatusDetail
                    ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
              ON Orders.OrderID = OrderStatusDes.OrderID`;
  let query = mysql.format(sql);
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
          message: "Không có đơn hàng",
        });
      } else {
        let sql = ` SELECT COUNT(*) AS Total
                            FROM Orders
                            JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate
                                  FROM OrderStatus
                                  JOIN OrderStatusDetail
                                    ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
                            ON Orders.OrderID = OrderStatusDes.OrderID `;
        let query = mysql.format(sql);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            // //Luu vao database
            arr.forEach(function (item, index, arrays) {
              item.CreateDate = moment(item.CreateDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              item.ModifyDate = moment(item.ModifyDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              item.EndDate = moment(item.EndDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
            });
            return res.status(200).json({
              success: true,
              data: arr,
            });
          }
        });
      }
    }
  });
};

//Change Status Order by MOD
let changeStatusOrder = async (req, res) => {
  // Get Email Of User
  const email = req.jwtDecoded.data.email;
  const idOrder = req.body.idOrder;
  const OrderStatusCode = req.body.OrderStatusCode;
  // var arraySave = [];
  // Run sql to get orderHistory
  if (OrderStatusCode === "2") {
    let sql = `SELECT Products.Quantity,Products.ProductID,Products.ProductName,OrderDetail.QuantityProduct FROM Products, OrderDetail WHERE OrderDetail.ProductID = Products.ProductID AND OrderDetail.OrderID = ?`;
    let query = mysql.format(sql, [idOrder]);
    connectionDB.query(query, async (err, resultP) => {
      if (err) {
        return res.status(200).json({ success: false, message: err });
      } else {
        //Lay ID day vao Database cho bang Product
        const arrP = await Array.apply(null, resultP);
        if (arrP.length === 0) {
          return res.status(200).json({ success: false, message: err });
        } else {
          // console.log(arrP);
          var check = true;
          var arrData = [];
          arrP.forEach((e) => {
            if (e.Quantity >= e.QuantityProduct) {
              arrData.push({
                ProductID: e.ProductID,
                Quantity: Number(e.Quantity - e.QuantityProduct),
              });
            } else {
              check = false;
              return res.status(200).json({
                success: false,
                message: `${e.ProductName} đã hết hàng`,
              });
            }
          });
          if (check) {
            let sql = ` UPDATE OrderStatusDetail
                              SET OrderStatusID=?,MODEmail=?,ModifyDate=?
                              WHERE OrderStatusDetail.OrderID=?`;
            const day = new Date();
            const today =
              day.getFullYear() + "-" + day.getMonth() + "-" + day.getDate();
            let query = mysql.format(sql, [
              OrderStatusCode,
              email,
              today,
              idOrder,
            ]);
            connectionDB.query(query, async (err, result) => {
              if (err) {
                return res.status(200).json({ success: false, message: err });
              } else {
                arrData.forEach(async (item) => {
                  let sql = `UPDATE Products
                                 SET Quantity=?,ProductStatus=?
                                 WHERE ProductID=?`;
                  const ProductStatus =
                    item.Quantity > 0 ? "Còn Hàng" : "Hết Hàng";
                  let query = mysql.format(sql, [
                    item.Quantity,
                    ProductStatus,
                    item.ProductID,
                  ]);
                  await connectionDB.query(query, (err, resultProductNew) => {
                    if (err) {
                      return res
                        .status(200)
                        .json({ success: false, message: err });
                    } else {
                    }
                  });
                });
                return res.status(200).json({
                  success: true,
                  message: "Thay đổi trạng thái đơn hàng thành công",
                });
              }
            });
          }
        }
      }
    });
  } else if (OrderStatusCode === "3") {
    let sql = ` UPDATE Orders
                SET Orders.EndDate=?
                WHERE Orders.OrderID=?`;
    const today = moment().format(`YYYY-MM-DD`);
    let query = mysql.format(sql, [today, idOrder]);
    connectionDB.query(query, async (err, result) => {
      if (err) {
        return res.status(200).json({ success: false, message: err });
      } else {
        let sql = ` UPDATE OrderStatusDetail
        SET OrderStatusID=?,MODEmail=?,ModifyDate=?
        WHERE OrderStatusDetail.OrderID=?`;
        const day = new Date();
        const today =
          day.getFullYear() + "-" + day.getMonth() + "-" + day.getDate();
        let query = mysql.format(sql, [OrderStatusCode, email, today, idOrder]);
        connectionDB.query(query, async (err, result) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            return res.status(200).json({
              success: true,
              message: "Thay đổi trạng thái đơn hàng thành công!",
            });
          }
        });
      }
    });
  } else if (OrderStatusCode === "4") {
    let sql = `SELECT
                  ProductID,
                  QuantityProduct,
                  OrderDetail.OrderID,
                  OrderStatusDetail.OrderStatusID
              FROM
                  OrderDetail,
                  OrderStatusDetail
              WHERE
                  OrderStatusDetail.OrderID = OrderDetail.OrderID AND OrderDetail.OrderID = ?`;
    let query = mysql.format(sql, [idOrder]);
    connectionDB.query(query, async (err, result) => {
      if (err) {
        return res.status(200).json({ success: false, message: err });
      } else {
        const arrP = await Array.apply(null, result);
        if (arrP[0].OrderStatusID === 2) {
          let sql = ` UPDATE Orders
                SET Orders.EndDate=?
                WHERE Orders.OrderID=?`;
          const today = moment().format(`YYYY-MM-DD`);
          let query = mysql.format(sql, [today, idOrder]);
          connectionDB.query(query, async (err, resultP) => {
            if (err) {
              return res.status(200).json({ success: false, message: err });
            } else {
              let sql = ` UPDATE OrderStatusDetail
                          SET OrderStatusID=?,MODEmail=?,ModifyDate=?
                          WHERE OrderStatusDetail.OrderID=?`;
              const day = new Date();
              const today =
                day.getFullYear() + "-" + day.getMonth() + "-" + day.getDate();
              let query = mysql.format(sql, [
                OrderStatusCode,
                email,
                today,
                idOrder,
              ]);
              connectionDB.query(query, async (err, resultS) => {
                if (err) {
                  return res.status(200).json({ success: false, message: err });
                } else {
                  //Cap nhat lai so luong don hang
                  arrP.forEach(async (el) => {
                    let sql = `UPDATE Products SET Quantity = Quantity + ${el.QuantityProduct}, ProductStatus = 'Còn Hàng' WHERE ProductID = ?`;
                    let query = mysql.format(sql, [el.ProductID]);
                    await connectionDB.query(query, async (err, resultP) => {
                      if (err) {
                        return res
                          .status(200)
                          .json({ success: false, message: err });
                      } else {
                      }
                    });
                  });
                  return res.status(200).json({
                    success: true,
                    message: "Thay đổi trạng thái đơn hàng thành công!",
                  });
                }
              });
            }
          });
        } else {
          let sql = ` UPDATE Orders
                SET Orders.EndDate=?
                WHERE Orders.OrderID=?`;
          const today = moment().format(`YYYY-MM-DD`);
          let query = mysql.format(sql, [today, idOrder]);
          connectionDB.query(query, async (err, resultP) => {
            if (err) {
              return res.status(200).json({ success: false, message: err });
            } else {
              let sql = ` UPDATE OrderStatusDetail
                          SET OrderStatusID=?,MODEmail=?,ModifyDate=?
                          WHERE OrderStatusDetail.OrderID=?`;
              const day = new Date();
              const today =
                day.getFullYear() + "-" + day.getMonth() + "-" + day.getDate();
              let query = mysql.format(sql, [
                OrderStatusCode,
                email,
                today,
                idOrder,
              ]);
              connectionDB.query(query, async (err, resultS) => {
                if (err) {
                  return res.status(200).json({ success: false, message: err });
                } else {
                  return res.status(200).json({
                    success: true,
                    message: "Thay đổi trạng thái đơn hàng thành công!",
                  });
                }
              });
            }
          });
        }
      }
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Thay đổi trạng thái đơn hàng thành công!",
    });
  }
};

//Change Status Order by MOD
// let changeStatusOrder = async (req, res) => {
//   // Get Email Of User
//   const email = req.jwtDecoded.data.email;
//   const idOrder = req.body.idOrder;
//   const OrderStatusCode = req.body.OrderStatusCode;
//   var arraySave = [];
//   // Run sql to get orderHistory
//   if (OrderStatusCode === "2") {
//     let sql = `SELECT ProductID,QuantityProduct FROM OrderDetail WHERE OrderDetail.OrderID=?`;
//     let query = mysql.format(sql, [idOrder]);
//     connectionDB.query(query, async (err, resultP) => {
//       if (err) {
//         return res.status(200).json({ success: false, message: err });
//       } else {
//         //Lay ID day vao Database cho bang Product
//         const arrP = await Array.apply(null, resultP);
//         if (arrP.length === 0) {
//           return res.status(200).json({
//             success: false,
//             message: "Error with this order!",
//           });
//         } else {
//           await arrP.forEach(function (item, index, arrays) {
//             // Luu vao Database
//             let sql = `SELECT Quantity,ProductName FROM Products WHERE ProductID=?`;
//             let query = mysql.format(sql, [item.ProductID]);
//             connectionDB.query(query, async (err, resultProduct) => {
//               if (err) {
//                 return res.status(200).json({ success: false, message: err });
//               } else {
//                 const arrProduct = await Array.apply(null, resultProduct);
//                 if (arrProduct[0].Quantity - item.QuantityProduct >= 0) {
//                   arraySave.push({
//                     ProductID: item.ProductID,
//                     Quantity: Number(
//                       arrProduct[0].Quantity - item.QuantityProduct
//                     ),
//                   });
//                 } else {
//                   return res.status(200).json({
//                     success: false,
//                     message: `Product ${arrProduct[0].ProductName} is out of order!`,
//                   });
//                 }
//                 if (index === arrP.length - 1) {
//                   await arraySave.forEach(function (item, index, arrays) {
//                     // Luu vao Database
//                     let sql = `UPDATE Products
//                              SET Quantity=?,ProductStatus=?
//                              WHERE ProductID=?`;
//                     const ProductStatus =
//                       item.Quantity > 0 ? "Còn Hàng" : "Hết Hàng";
//                     let query = mysql.format(sql, [
//                       item.Quantity,
//                       ProductStatus,
//                       item.ProductID,
//                     ]);
//                     connectionDB.query(query, async (err, resultProductNew) => {
//                       if (err) {
//                         return res
//                           .status(200)
//                           .json({ success: false, message: err });
//                       } else {
//                         let sql = ` UPDATE OrderStatusDetail
//                                     SET OrderStatusID=?,MODEmail=?,ModifyDate=?
//                                     WHERE OrderStatusDetail.OrderID=?`;
//                         const day = new Date();
//                         const today =
//                           day.getFullYear() +
//                           "-" +
//                           day.getMonth() +
//                           "-" +
//                           day.getDate();
//                         let query = mysql.format(sql, [
//                           OrderStatusCode,
//                           email,
//                           today,
//                           idOrder,
//                         ]);
//                         connectionDB.query(query, async (err, result) => {
//                           if (err) {
//                             return res
//                               .status(200)
//                               .json({ success: false, message: err });
//                           } else {
//                             return res.status(200).json({
//                               success: true,
//                               message: "Thay đổi trạn thái đơn hàng thành công",
//                             });
//                           }
//                         });
//                         // return res.status(200).json({
//                         //   success: true,
//                         //   message: "Change Status Order Success!",
//                         // });
//                       }
//                     });
//                   });
//                 }
//               }
//             });
//           });
//         }
//       }
//     });
//   }
//   if (OrderStatusCode === "3") {
//     let sql = ` UPDATE Orders
//                 SET Orders.EndDate=?
//                 WHERE Orders.OrderID=?`;
//     const today = moment().format(`YYYY-MM-DD`);
//     let query = mysql.format(sql, [today, idOrder]);
//     connectionDB.query(query, async (err, result) => {
//       if (err) {
//         return res.status(200).json({ success: false, message: err });
//       } else {
//         let sql = ` UPDATE OrderStatusDetail
//         SET OrderStatusID=?,MODEmail=?,ModifyDate=?
//         WHERE OrderStatusDetail.OrderID=?`;
//         const day = new Date();
//         const today =
//           day.getFullYear() + "-" + day.getMonth() + "-" + day.getDate();
//         let query = mysql.format(sql, [OrderStatusCode, email, today, idOrder]);
//         connectionDB.query(query, async (err, result) => {
//           if (err) {
//             return res.status(200).json({ success: false, message: err });
//           } else {
//             return res.status(200).json({
//               success: true,
//               message: "Thay đổi trạng thái đơn hàng thành công!",
//             });
//           }
//         });
//       }
//     });
//   }
//   if (OrderStatusCode === "4") {
//     let sql = `SELECT
//                   ProductID,
//                   QuantityProduct,
//                   OrderDetail.OrderID,
//                   OrderStatusDetail.OrderStatusID
//               FROM
//                   OrderDetail,
//                   OrderStatusDetail
//               WHERE
//                   OrderStatusDetail.OrderID = OrderDetail.OrderID AND OrderDetail.OrderID = ?`;
//     let query = mysql.format(sql, [idOrder]);
//     connectionDB.query(query, async (err, result) => {
//       if (err) {
//         return res.status(200).json({ success: false, message: err });
//       } else {
//         const arrP = await Array.apply(null, result);
//         console.log(arrP);
//         if (arrP[0].OrderStatusID === 2) {
//           let sql = ` UPDATE Orders
//                 SET Orders.EndDate=?
//                 WHERE Orders.OrderID=?`;
//           const today = moment().format(`YYYY-MM-DD`);
//           let query = mysql.format(sql, [today, idOrder]);
//           connectionDB.query(query, async (err, resultP) => {
//             if (err) {
//               return res.status(200).json({ success: false, message: err });
//             } else {
//               let sql = ` UPDATE OrderStatusDetail
//                           SET OrderStatusID=?,MODEmail=?,ModifyDate=?
//                           WHERE OrderStatusDetail.OrderID=?`;
//               const day = new Date();
//               const today =
//                 day.getFullYear() + "-" + day.getMonth() + "-" + day.getDate();
//               let query = mysql.format(sql, [
//                 OrderStatusCode,
//                 email,
//                 today,
//                 idOrder,
//               ]);
//               connectionDB.query(query, async (err, resultS) => {
//                 if (err) {
//                   return res.status(200).json({ success: false, message: err });
//                 } else {
//                   //Cap nhat lai so luong don hang
//                   arrP.forEach(async (el) => {
//                     let sql = `UPDATE Products SET Quantity = Quantity + ${el.QuantityProduct}, ProductStatus = 'Còn Hàng' WHERE ProductID = ?`;
//                     let query = mysql.format(sql, [el.ProductID]);
//                     await connectionDB.query(query, async (err, resultP) => {
//                       if (err) {
//                         return res
//                           .status(200)
//                           .json({ success: false, message: err });
//                       } else {
//                       }
//                     });
//                   });
//                   return res.status(200).json({
//                     success: true,
//                     message: "Thay đổi trạng thái đơn hàng thành công!",
//                   });
//                 }
//               });
//             }
//           });
//         } else {
//           return res.status(200).json({
//             success: true,
//             message: "Thay đổi trạng thái đơn hàng thành công!",
//           });
//         }
//       }
//     });
//   }
//   // return res.status(200).json({
//   //   success: true,
//   //   message: "Thay đổi trạng thái đơn hàng thành công!",
//   // });
// };

//Change Status Order by MOD
let getListOrderByStatusCode = async (req, res) => {
  // Get Email Of User
  // Get Email Of User
  const page = req.query.page;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;
  const OrderStatusID = req.body.OrderStatusID;
  // Run sql to get orderHistory
  let sql = ` SELECT Orders.OrderID,Orders.PaymentID,Orders.TotalPrice,Orders.ShipAddress,Orders.CreateDate,Orders.EndDate,Orders.QuantityPaper,Orders.Cash,OrderStatusDes.Description,OrderStatusDes.ModifyDate
              FROM Orders
              JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate,OrderStatusDetail.OrderStatusID
                    FROM OrderStatus
                    JOIN OrderStatusDetail
                    ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
              ON Orders.OrderID = OrderStatusDes.OrderID
              AND OrderStatusDes.OrderStatusID = ?
              LIMIT ?
              OFFSET ?`;
  let query = mysql.format(sql, [OrderStatusID, pageSize, offset]);
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
          message: "Không có đơn hàng!",
        });
      } else {
        let sql = ` SELECT COUNT(*) AS Total
                            FROM Orders
                            JOIN (SELECT OrderStatusDetail.OrderID,OrderStatus.Description,OrderStatusDetail.ModifyDate,OrderStatusDetail.OrderStatusID
                                  FROM OrderStatus
                                  JOIN OrderStatusDetail
                                  ON OrderStatus.OrderStatusID = OrderStatusDetail.OrderStatusID) OrderStatusDes
                            ON Orders.OrderID = OrderStatusDes.OrderID
                            AND OrderStatusDes.OrderStatusID = ?`;
        let query = mysql.format(sql, [OrderStatusID]);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            const totalPage = Math.ceil(array[0].Total / pageSize);
            // //Luu vao database
            arr.forEach(function (item, index, arrays) {
              item.CreateDate = moment(item.CreateDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              item.ModifyDate = moment(item.ModifyDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              item.EndDate = moment(item.EndDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
            });
            return res.status(200).json({
              success: true,
              data: arr,
              totalPage: totalPage, // Total page
            });
          }
        });
      }
    }
  });
};

module.exports = {
  getInforAbout: getInforAbout,
  addNewOrderByUser: addNewOrderByUser,
  showOrderListByEmail: showOrderListByEmail,
  showOrderByEmail: showOrderByEmail,
  showOrderListForMOD: showOrderListForMOD,
  changeStatusOrder: changeStatusOrder,
  getListOrderByStatusCode: getListOrderByStatusCode,
  showOrderByID: showOrderByID,
};
