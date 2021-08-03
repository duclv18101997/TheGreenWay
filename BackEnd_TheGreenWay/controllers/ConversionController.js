const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const connectionDB = mysql.createConnection(config.databaseOptions);
var moment = require("moment-timezone");
/**
 * controller Conversion
 */

//get Info Conversion by ID
let getInfoConversionbyID = async (req, res) => {
  const idConversion = req.query.idConversion;
  let sql = ` SELECT ConversionID, PaperPrice, CreatedAt, Status, ModifyDate FROM ConversionPaper WHERE ConversionPaper.ConversionID=? `;
  let query = mysql.format(sql, [idConversion]);
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
          .json({ success: false, message: "No conversion tables exist !" });
      } else {
        arr[0].CreatedAt = moment(arr[0].CreatedAt)
          .tz("Asia/Ho_Chi_Minh")
          .format();
        arr[0].ModifyDate = moment(arr[0].ModifyDate)
          .tz("Asia/Ho_Chi_Minh")
          .format();
        return res.status(200).json({
          success: true,
          data: arr[0],
        });
      }
    }
  });
};

//get Info Conversion by ID
let addNewConversion = async (req, res) => {
  let sql = `SELECT MAX(ConversionPaper.ConversionID) AS ConversionID FROM ConversionPaper`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({ success: false, message: err });
    } else {
      //Lay ID day vao Database cho bang Product
      const arr = await Array.apply(null, result);
      const ConversionID = arr[0].ConversionID + 1;
      const empty = {
        ConversionID: ConversionID,
        PaperPrice: Number(req.body.PaperPrice),
        CreatedAt: moment(req.body.CreatedAt).format("YYYY-MM-DD"),
        ModifyDate: moment(req.body.ModifyDate).format("YYYY-MM-DD"),
        Status: req.body.Status,
      };
      // Luu vao Database khi chi co 1 cai dc Hoat Dong thoi
      connectionDB.query(
        "INSERT INTO ConversionPaper SET ? ",
        empty,
        (err, result) => {
          if (err) {
            debug(err);
            return res.status(200).json({
              success: false,
              message: "Add New Conversion is Unsuccess!",
            });
          } else {
            if (req.body.Status === "Đang Hoạt Động") {
              let sql = `UPDATE ConversionPaper 
                                    SET Status=?
                                    WHERE ConversionPaper.ConversionID NOT IN (?)`;
              let query = mysql.format(sql, ["Không Hoạt Động", ConversionID]);
              connectionDB.query(query, async (err, results) => {
                if (err) {
                  return res.status(200).json({
                    success: false,
                    message: "Add New Conversion is Unsuccess!",
                  });
                } else {
                  return res.status(200).json({
                    success: true,
                    message: "Add New Conversion is Success!",
                  });
                }
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "Add New Conversion is Success!",
              });
            }
          }
        }
      );
    }
  });
};

//update Conversion var d = new Date(); debug(d.getDate()+"/"+d.getDay())
let updateConversion = async (req, res) => {
  //Get ID Post
  const idConversion = req.query.idConversion;
  //Get Information Post
  const PaperPrice = Number(req.body.PaperPrice);
  const CreatedAt = moment(req.body.CreatedAt).format("YYYY-MM-DD");
  const ModifyDate = moment(req.body.ModifyDate).format("YYYY-MM-DD");
  const Status = req.body.Status;
  //Update Post
  let sql = `UPDATE ConversionPaper 
                SET PaperPrice=?,CreatedAt=?,ModifyDate=?,Status=?
                WHERE ConversionPaper.ConversionID=?`;
  let query = mysql.format(sql, [
    PaperPrice,
    CreatedAt,
    ModifyDate,
    Status,
    idConversion,
  ]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Update Conversion Failed!" });
    } else {
      if (req.body.Status === "Đang Hoạt Động") {
        let sqlNew = `UPDATE ConversionPaper 
                                SET Status=?
                                WHERE ConversionPaper.ConversionID NOT IN (?)`;
        let queryNew = mysql.format(sqlNew, ["Không Hoạt Động", idConversion]);
        connectionDB.query(queryNew, async (err, results) => {
          if (err) {
            return res.status(200).json({
              success: false,
              message: "Update Conversion is Unsuccess!",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Update Conversion is Success!",
            });
          }
        });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Update Conversion is Success!" });
      }
    }
  });
};

// get Conversion working
let getConversionWorking = async (req, res) => {
  //Get ID Post
  //Update Post
  let sql = `SELECT ConversionID, PaperPrice, CreatedAt, Status, ModifyDate FROM ConversionPaper WHERE ConversionPaper.Status="Đang Hoạt Động"`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Get Conversion Working Failed!" });
    } else {
      const arr = await Array.apply(null, result);
      if (arr.length === 0) {
        return res
          .status(200)
          .json({ success: false, message: "No Conversion Working exist !" });
      } else {
        arr[0].CreatedAt = moment(arr[0].CreatedAt)
          .tz("Asia/Ho_Chi_Minh")
          .format();
        arr[0].ModifyDate = moment(arr[0].ModifyDate)
          .tz("Asia/Ho_Chi_Minh")
          .format();
        return res.status(200).json({
          success: true,
          data: arr[0],
        });
      }
    }
  });
};

// get Conversion List
let getListConversion = async (req, res) => {
  //Get ID Post
  //Update Post
  let sql = ` SELECT ConversionID, PaperPrice, CreatedAt, Status, ModifyDate FROM ConversionPaper WHERE ConversionPaper.Status="Đang Hoạt Động"`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Get List Conversion Failed!" });
    } else {
      const arr = await Array.apply(null, result);
      if (arr.length === 0) {
        return res
          .status(200)
          .json({ success: false, message: "No Conversion exist !" });
      } else {
        let sqlNotWorking = ` SELECT ConversionID, PaperPrice, CreatedAt, Status, ModifyDate FROM ConversionPaper WHERE ConversionPaper.Status="Không Hoạt Động"`;
        let queryNotWorking = mysql.format(sqlNotWorking);
        connectionDB.query(queryNotWorking, async (err, results) => {
          if (err) {
            return res
              .status(200)
              .json({ success: false, message: "Get List Conversion Failed!" });
          } else {
            const array = await Array.apply(null, results);
            if (array.length === 0) {
              return res
                .status(200)
                .json({ success: false, message: "No Conversion exist !" });
            } else {
              arr[0].CreatedAt = moment(arr[0].CreatedAt)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              arr[0].ModifyDate = moment(arr[0].ModifyDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              array.forEach(function (item, index, arrays) {
                item.CreateDate = moment(item.CreateDate)
                  .tz("Asia/Ho_Chi_Minh")
                  .format();
                item.ModifyDate = moment(item.ModifyDate)
                  .tz("Asia/Ho_Chi_Minh")
                  .format();
              });
              return res.status(200).json({
                success: true,
                ConversionWorking: arr[0],
                ConversionNotWorking: array,
              });
            }
          }
        });
      }
    }
  });
};

module.exports = {
  getInfoConversionbyID: getInfoConversionbyID,
  addNewConversion: addNewConversion,
  updateConversion: updateConversion,
  getConversionWorking: getConversionWorking,
  getListConversion: getListConversion,
};
