const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const connectionDB = mysql.createConnection(config.databaseOptions);
var moment = require("moment-timezone");
/**
 * controller Payment
 */

//get Info Payment by ID
let getPayment = async (req, res) => {
  let sql = `SELECT PaymentID, Description FROM PaymentMethods`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      const arr = await Array.apply(null, result);
      if (arr.length === 0) {
        return res
          .status(200)
          .json({ success: false, message: "No Payment exist !" });
      } else {
        return res.status(200).json({
          success: true,
          data: arr,
        });
      }
    }
  });
};

//Add New Payment
let addNewPayment = async (req, res) => {
  let sql = `SELECT MAX(PaymentMethods.PaymentID) AS PaymentID FROM PaymentMethods`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({ success: false, message: err });
    } else {
      //Lay ID day vao Database cho bang Product
      const arr = await Array.apply(null, result);
      const PaymentID = arr[0].PaymentID + 1;
      const empty = {
        PaymentID: PaymentID,
        Description: req.body.Description,
      };
      // Luu vao Database khi chi co 1 cai dc Hoat Dong thoi
      connectionDB.query(
        "INSERT INTO PaymentMethods SET ? ",
        empty,
        (err, result) => {
          if (err) {
            return res.status(200).json({
              success: false,
              message: "Add New PaymentMethod is Unsuccess!",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Add New PaymentMethod is Success!",
            });
          }
        }
      );
    }
  });
};

//update Payment var d = new Date(); debug(d.getDate()+"/"+d.getDay())
let updatePayment = async (req, res) => {
  //Get ID Post
  const idPayment = req.query.idPayment;
  //Get Information Post
  const Description = req.body.Description;
  //Update Post
  let sql = `UPDATE PaymentMethods 
                SET Description=?
                WHERE PaymentMethods.PaymentID=?`;
  let query = mysql.format(sql, [Description, idPayment]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Update Payment Failed!" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Update Payment is Success!" });
    }
  });
};

//update Payment var d = new Date(); debug(d.getDate()+"/"+d.getDay())
let detelePayment = async (req, res) => {
  //Get ID Post
  const idPayment = req.query.idPayment;
  //Get Information Post
  let sql = `DELETE FROM PaymentMethods WHERE PaymentMethods.PaymentID=?`;
  let query = mysql.format(sql, [idPayment]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Remove Payment Failed!" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Remove Payment Success!" });
    }
  });
};

module.exports = {
  getPayment: getPayment,
  addNewPayment: addNewPayment,
  updatePayment: updatePayment,
  detelePayment: detelePayment,
};
