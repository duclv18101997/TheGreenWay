const debug = console.log.bind(console);
const mysql = require("mysql");
var config = require("../config/configDB");
const connectionDB = mysql.createConnection(config.databaseOptions);
var moment = require("moment-timezone");
/**
 * controller user
 */

// get information of user fron database
let getinfobyid = async (req, res) => {
  const idProduct = req.query.idProduct;
  // get email from request after handle of authmiddleware
  let sql = ` SELECT * FROM (
                SELECT Products.ProductID, Products.CategoryID, Products.ProductName, Products.ProductPrice,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity, Products.ImageDetail,COUNT(LikesOfProduct.UserEmail) AS NumberOfLike
                FROM Products
                LEFT JOIN LikesOfProduct
                ON Products.ProductID = LikesOfProduct.ProductID
                GROUP BY Products.ProductID ) GetProduct
                WHERE GetProduct.ProductID =?`;
  let query = mysql.format(sql, [idProduct]);
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
          .json({ success: false, message: "Product is not exist!" });
      } else {
        let sqlGetImage = `SELECT ImagesOfProduct.ImageID,ImagesOfProduct.urlImage FROM ImagesOfProduct WHERE ProductID= ?`;
        let queryGetImage = mysql.format(sqlGetImage, [idProduct]);
        connectionDB.query(queryGetImage, async (err, results) => {
          if (err) {
            // chua ton tai thi bao loi
            return res.status(200).json({ success: false, message: err });
          } else {
            // Da ton tai thi tao ma token va gui ve client
            const arrayImage = await Array.apply(null, results);
            if (arrayImage.length === 0) {
              arr[0].CreateDate = moment(arr[0].CreateDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
              return res.status(200).json({
                success: true,
                data: arr[0],
                images: "No Images",
              });
            } else {
              return res.status(200).json({
                success: true,
                data: arr[0],
                images: arrayImage,
              });
            }
          }
        });
      }
    }
  });
};

//get list product email like
let getListProductLike = async (req, res) => {
  const email = req.jwtDecoded.data.email;
  const page = req.query.page;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;
  // get email from request after handle of authmiddleware
  let sql = ` SELECT * FROM
                (SELECT Products.ProductID, Products.CategoryID, Products.ProductName, Products.ProductPrice,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity, Products.ImageDetail,LikesOfProduct.UserEmail
                FROM LikesOfProduct
                JOIN Products
                ON Products.ProductID = LikesOfProduct.ProductID) GetProduct
                WHERE GetProduct.UserEmail = ?
                LIMIT ?
                OFFSET ?`;
  let query = mysql.format(sql, [email, pageSize, offset]);
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
          .json({ success: false, message: "Không có sản phẩm!" });
      } else {
        // Chay Query de lay total page
        let sql = ` SELECT COUNT(*) AS Total FROM
                            (SELECT Products.ProductID, Products.CategoryID, Products.ProductName, Products.ProductPrice,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity, Products.ImageDetail,LikesOfProduct.UserEmail
                            FROM LikesOfProduct
                            JOIN Products
                            ON Products.ProductID = LikesOfProduct.ProductID) GetProduct
                            WHERE GetProduct.UserEmail = ?`;
        let query = mysql.format(sql, [email]);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results); // chi dung de lay total
            const totalPage = Math.ceil(array[0].Total / pageSize);
            // //Luu vao database
            arr.forEach(function (item, index, arrays) {
              item.CreateDate = moment(item.CreateDate)
                .tz("Asia/Ho_Chi_Minh")
                .format();
            });
            return res.status(200).json({
              success: true,
              data: arr,
              resultsize: array[0].Total,
              totalPage: totalPage, // Total page
            });
          }
        });
      }
    }
  });
};

// Like Product
let likeProduct = async (req, res) => {
  //Lay thong tin email
  const email = req.jwtDecoded.data.email;
  const idProduct = req.query.id;
  // get email from request after handle of authmiddleware
  let sql = `SELECT * FROM LikesOfProduct WHERE ProductID=? AND UserEmail=?`;
  let query = mysql.format(sql, [idProduct, email]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      // chua ton tai thi bao loi
      return res.status(200).json({ success: false, message: err });
    } else {
      // Da ton tai thi tao ma token va gui ve client
      const arr = await Array.apply(null, result);
      if (arr.length === 0) {
        // Chua co thi like
        const empty = {
          UserEmail: email,
          ProductID: idProduct,
        };
        // Luu vao Database
        connectionDB.query(
          "INSERT INTO LikesOfProduct SET ? ",
          empty,
          (err, result) => {
            if (err) {
              return res
                .status(200)
                .json({ success: false, message: "ERROR!" });
            } else {
              return res
                .status(200)
                .json({ success: true, message: "Like is Success!" });
            }
          }
        );
      } else {
        // Co roi thi unlike
        let sqlGetImage = `DELETE FROM LikesOfProduct WHERE ProductID=? AND UserEmail=?`;
        let queryGetImage = mysql.format(sqlGetImage, [idProduct, email]);
        connectionDB.query(queryGetImage, async (err, results) => {
          if (err) {
            // chua ton tai thi bao loi
            return res.status(200).json({ success: false, message: err });
          } else {
            // Da ton tai thi tao ma token va gui ve client
            return res.status(200).json({
              success: true,
              message: "UnLike is Success!",
            });
          }
        });
      }
    }
  });
};

// Lay thong tin Max,Min Price, Category, Name de phuc vu cho viec valicdate search nang cao, Categoty thi show check list
let getinfosearchProduct = async (req, res) => {
  // SQL to run
  let sql = `SELECT MAX(Products.ProductPrice) AS MaxPrice, MIN(Products.ProductPrice) AS MinPrice FROM Products`;
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
          message: "No Products !",
        });
      } else {
        // Chay Query de lay total page
        debug(arr[0].MaxPrice);
        debug(arr[0].MinPrice);
        let sqlCate = `SELECT CategoryID, CategoryDes FROM Categories`;
        let queryCate = mysql.format(sqlCate);
        connectionDB.query(queryCate, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            if (array.length === 0) {
              // Chua co thi like
              return res.status(200).json({
                success: false,
                message: "No Products !",
              });
            } else {
              // Chay Query de lay total page
              return res.status(200).json({
                success: true,
                maxPrice: arr[0].MaxPrice,
                minPrice: arr[0].MinPrice,
                categories: array,
              });
            }
          }
        });
      }
    }
  });
};

// Search Product Nang cao search by Price, Category, Name
let searchProduct = async (req, res) => {
  //ProductsCate.ProductID,ProductsCate.ProductName,ProductsCate.ProductPrice,ProductsCate.ImageDetail
  const page = req.query.page;
  const pageSize = 6;
  const category = req.query.category;
  const email = req.query.email;
  const offset = (page - 1) * pageSize;
  var stringSQL = "";
  // SQL Query to search Product
  const ProductName = await req.body.ProductName;
  stringSQL = ProductName
    ? stringSQL + ` AND lower(ProductName) like '%${ProductName}%' ESCAPE '!'`
    : stringSQL + "";
  const MaxPrice = await req.body.MaxPrice;
  stringSQL = MaxPrice
    ? stringSQL + ` AND ProductPrice <= ${MaxPrice}`
    : stringSQL + "";
  const MinPrice = await req.body.MinPrice;
  stringSQL = MinPrice
    ? stringSQL + ` AND ProductPrice >= ${MinPrice}`
    : stringSQL + "";
  // const CategoryID = await req.body.CategoryID;
  // stringSQL = CategoryID
  //   ? stringSQL + ` AND CategoryID = ${CategoryID}`
  //   : stringSQL + "";
  // SQL to run
  let sql = ` SELECT * FROM
  (SELECT CategoriesTable.ProductID,CategoriesTable.ProductName,CategoriesTable.ProductPrice,CategoriesTable.ImageDetail,CategoriesTable.NumberOfLikes,CategoriesTable.Quantity,LikeTable.UserEmail FROM
  (SELECT ProductsCate.ProductID,ProductsCate.ProductName,ProductsCate.ProductPrice,ProductsCate.ImageDetail,COUNT(LikesOfProduct.UserEmail) AS NumberOfLikes, ProductsCate.Quantity
          FROM (SELECT * FROM (SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.ImageDetail,Products.CategoryID,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity FROM Products JOIN Categories ON Products.CategoryID=Categories.CategoryID ) AB WHERE CategoryID = ?
              ${stringSQL} ) ProductsCate
          LEFT JOIN LikesOfProduct
          ON ProductsCate.ProductID=LikesOfProduct.ProductID
          GROUP BY ProductsCate.ProductID ) CategoriesTable
          JOIN (SELECT GetProduct.ProductID,GetProduct.UserEmail FROM
          (SELECT Products.ProductID, Products.CategoryID, Products.ProductName, Products.ProductPrice,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity, 								Products.ImageDetail,LikesOfProductA.UserEmail
          FROM Products
          LEFT JOIN (SELECT * FROM LikesOfProduct WHERE LikesOfProduct.UserEmail = ?)LikesOfProductA
          ON Products.ProductID = LikesOfProductA.ProductID) GetProduct ) LikeTable
          WHERE LikeTable.ProductID = CategoriesTable.ProductID ) ABC
                LIMIT ?
                OFFSET ?`;
  let query = mysql.format(sql, [category, email, pageSize, offset]);
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
          message: "Không có sản phẩm!",
        });
      } else {
        // Chay Query de lay total page
        let sql = `SELECT COUNT(*) AS Total
                            FROM (SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.ImageDetail
                                    FROM Products
                                    JOIN Categories
                                    ON Products.CategoryID=Categories.CategoryID
                                    WHERE Products.CategoryID = ?
                                    ${stringSQL} ) ProductsCate`;
        let query = mysql.format(sql, [category]);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results); // chi dung de lay total
            const totalPage = Math.ceil(array[0].Total / pageSize);
            // //Luu vao database
            return res.status(200).json({
              success: true,
              data: arr.map((el) => ({
                ...el,
                like: el.UserEmail ? "like" : "unLike",
              })),
              resultsize: array[0].Total,
              totalPage: totalPage, // Total page
            });
          }
        });
      }
    }
  });
};

// FullText search In MYSQL
let fulltextsearchProduct = async (req, res) => {
  //ProductsCate.ProductID,ProductsCate.ProductName,ProductsCate.ProductPrice,ProductsCate.ImageDetail
  const page = req.query.page;
  const email = req.query.email;
  const category = req.query.category;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;
  var stringSQL = req.body.fulltextsearch;
  let sql = ` SELECT * FROM
  (SELECT CategoriesTable.ProductID,CategoriesTable.ProductName,CategoriesTable.ProductPrice,CategoriesTable.ImageDetail,CategoriesTable.NumberOfLikes,CategoriesTable.Quantity,LikeTable.UserEmail FROM
  (SELECT ProductsCate.ProductID,ProductsCate.ProductName,ProductsCate.ProductPrice,ProductsCate.ImageDetail,COUNT(LikesOfProduct.UserEmail) AS NumberOfLikes, ProductsCate.Quantity
          FROM (SELECT * FROM (SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.ImageDetail,Products.CategoryID,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity FROM Products JOIN Categories ON Products.CategoryID=Categories.CategoryID AND Categories.CategoryID = ?) AB WHERE
                MATCH(ProductName) AGAINST('${stringSQL}' IN NATURAL LANGUAGE MODE)
                OR
                MATCH(Description) AGAINST('${stringSQL}' IN NATURAL LANGUAGE MODE)
                OR
                MATCH(ProductPrice) AGAINST('${stringSQL}' IN NATURAL LANGUAGE MODE) ) ProductsCate
          LEFT JOIN LikesOfProduct
          ON ProductsCate.ProductID=LikesOfProduct.ProductID
          GROUP BY ProductsCate.ProductID ) CategoriesTable
          JOIN (SELECT GetProduct.ProductID,GetProduct.UserEmail FROM
          (SELECT Products.ProductID, Products.CategoryID, Products.ProductName, Products.ProductPrice,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity, 								Products.ImageDetail,LikesOfProductA.UserEmail
          FROM Products
          LEFT JOIN (SELECT * FROM LikesOfProduct WHERE LikesOfProduct.UserEmail = ?)LikesOfProductA
          ON Products.ProductID = LikesOfProductA.ProductID) GetProduct ) LikeTable
          WHERE LikeTable.ProductID = CategoriesTable.ProductID ) ABC
          LIMIT ?
          OFFSET ?`;
  let query = mysql.format(sql, [category, email, pageSize, offset]);
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
          message: "No Products !",
        });
      } else {
        // Chay Query de lay total page
        let sqlTotal = `(SELECT COUNT(*) AS Total FROM (SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.ImageDetail,Products.CategoryID,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity FROM Products JOIN Categories ON Products.CategoryID=Categories.CategoryID AND Categories.CategoryID = ?) AB WHERE MATCH(ProductName) AGAINST('${stringSQL}' IN NATURAL LANGUAGE MODE) OR MATCH(Description) AGAINST('${stringSQL}' IN NATURAL LANGUAGE MODE) OR MATCH(ProductPrice) AGAINST('${stringSQL}' IN NATURAL LANGUAGE MODE) )`;
        let queryTotal = mysql.format(sqlTotal, [category]);
        connectionDB.query(queryTotal, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results); // chi dung de lay total
            const totalPage = Math.ceil(array[0].Total / pageSize);
            // //Luu vao database
            return res.status(200).json({
              success: true,
              data: arr.map((el) => ({
                ...el,
                like: el.UserEmail ? "like" : "unLike",
              })),
              resultsize: array[0].Total,
              totalPage: totalPage, // Total page
            });
          }
        });
      }
    }
  });
};

// Get Product By Category 1 page have 6 entry
let getProductsByCategory = async (req, res) => {
  //Get ID category
  const idCategory = req.query.idCategory;
  const email = req.query.email;
  const page = req.query.page;
  const pageSize = 6;
  const offset = (page - 1) * pageSize;
  let sql = `SELECT * FROM
  (SELECT CategoriesTable.ProductID,CategoriesTable.ProductName,CategoriesTable.ProductPrice,CategoriesTable.ImageDetail,CategoriesTable.NumberOfLikes,CategoriesTable.Quantity,LikeTable.UserEmail FROM
  (SELECT ProductsCate.ProductID,ProductsCate.ProductName,ProductsCate.ProductPrice,ProductsCate.ImageDetail,COUNT(LikesOfProduct.UserEmail) AS NumberOfLikes, ProductsCate.Quantity
          FROM (SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.ImageDetail, Products.Quantity
                  FROM Products
                  JOIN Categories
                  ON Products.CategoryID=Categories.CategoryID
                  AND Categories.CategoryID= ? ) ProductsCate
          LEFT JOIN LikesOfProduct
          ON ProductsCate.ProductID=LikesOfProduct.ProductID
          GROUP BY ProductsCate.ProductID ) CategoriesTable
          JOIN (SELECT GetProduct.ProductID,GetProduct.UserEmail FROM
          (SELECT Products.ProductID, Products.CategoryID, Products.ProductName, Products.ProductPrice,Products.Description,Products.ProductStatus,Products.CreateDate,Products.Quantity, 								Products.ImageDetail,LikesOfProductA.UserEmail
          FROM Products
          LEFT JOIN (SELECT * FROM LikesOfProduct WHERE LikesOfProduct.UserEmail = ?)LikesOfProductA
          ON Products.ProductID = LikesOfProductA.ProductID) GetProduct ) LikeTable
          WHERE LikeTable.ProductID = CategoriesTable.ProductID ) ABC
          LIMIT ?
          OFFSET ?`;
  let query = mysql.format(sql, [idCategory, email, pageSize, offset]);
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
          message: "Không có sản phẩm!",
        });
      } else {
        let sql = `SELECT COUNT(*) AS Total
                            FROM (SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.ImageDetail
                                    FROM Products
                                    JOIN Categories
                                    ON Products.CategoryID=Categories.CategoryID
                                    AND Categories.CategoryID=?) ProductsCate`;
        let query = mysql.format(sql, [idCategory]);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            const totalPage = Math.ceil(array[0].Total / pageSize);
            // //Luu vao database

            return res.status(200).json({
              success: true,
              data: arr.map((el) => ({
                ...el,
                like: el.UserEmail ? "like" : "unLike",
              })),
              totalPage: totalPage, // Total page
            });
          }
        });
      }
    }
  });
};

let getProductAllByCategory = async (req, res) => {
  const cate = req.query.cate;
  let sql = ` SELECT ProductID,ProductName,ImageDetail FROM Products WHERE CategoryID = ?`;
  let query = mysql.format(sql, [cate]);
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
          message: "Không có sản phẩm!",
        });
      } else {
        return res.status(200).json({
          success: true,
          data: arr,
        });
      }
    }
  });
};

// Get List All Product 1 page have 6 entry
let getProducts = async (req, res) => {
  //Get ID category
  let sql = ` SELECT Products.CategoryID, Products.ProductID,Products.ProductName,Products.ProductPrice,Products.ImageDetail,COUNT(LikesOfProduct.UserEmail) AS NumberOfLikes, Products.Quantity
                FROM Products
                LEFT JOIN LikesOfProduct
                ON Products.ProductID=LikesOfProduct.ProductID
                GROUP BY Products.ProductID`;
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
          message: "Không có sản phẩm!",
        });
      } else {
        let sql = `SELECT COUNT(*) AS Total FROM Products`;
        let query = mysql.format(sql);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            // //Luu vao database
            return res.status(200).json({
              success: true,
              data: arr,
              // totalPage: totalPage, // Total page
            });
          }
        });
      }
    }
  });
};

// Get List All Product 1 page have 6 entry
let getProductsStatus = async (req, res) => {
  //Get ID category
  let sql = `SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.Quantity FROM Products WHERE Products.ProductStatus='Hết Hàng'`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({ success: false, message: err });
    } else {
      //Lay ID day vao Database cho bang Product
      const arr = await Array.apply(null, result);
      let sql = `SELECT Products.ProductID,Products.ProductName,Products.ProductPrice,Products.Quantity FROM Products WHERE Products.ProductStatus='Còn Hàng'`;
      let query = mysql.format(sql);
      connectionDB.query(query, async (err, results) => {
        if (err) {
          return res.status(200).json({ success: false, message: err });
        } else {
          //Lay ID day vao Database cho bang Product
          const array = await Array.apply(null, results);
          // //Luu vao database
          return res.status(200).json({
            success: true,
            dataHetHang: arr,
            dataConHang: array, // Total page
          });
        }
      });
    }
  });
};

// Add new product
let addNewProduct = async (req, res) => {
  let sql = `SELECT MAX(Products.ProductID) AS IDProduct FROM Products`;
  let query = mysql.format(sql);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({ success: false, message: err });
    } else {
      //Lay ID day vao Database cho bang Product
      const arr = await Array.apply(null, result);
      const idProduct = arr[0].IDProduct + 1;
      // //Luu vao database
      const QuantityProduct = req.body.Quantity;
      // Check ProductStatus
      const ProductStatus = QuantityProduct > 0 ? "Còn Hàng" : "Hết Hàng";
      // Check Image Default
      const ImageDetail = req.body.ImageDetail
        ? req.body.ImageDetail
        : "https://firebasestorage.googleapis.com/v0/b/demoweb-2d974.appspot.com/o/images%2Fproduct_packaging_pixel_perfect_color_line_icons_2-cardboard-512.png?alt=media&token=a9b4e229-efa4-49bd-9d3d-6cd0510d668c";
      // Create empty
      const empty = {
        ProductID: idProduct,
        CategoryID: req.body.CategoryID,
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        Description: req.body.Description,
        ProductStatus: ProductStatus,
        CreateDate: moment(req.body.CreateDate).format("YYYY-MM-DD"),
        Quantity: QuantityProduct,
        ImageDetail: ImageDetail,
      };
      // Luu vao Database
      connectionDB.query(
        "INSERT INTO Products SET ? ",
        empty,
        (err, result) => {
          if (err) {
            debug(err);
            return res.status(200).json({
              success: false,
              message: "Thêm sản phẩm không thành công!",
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Thêm sản phẩm thành công!",
              idProduct: idProduct,
            });
          }
        }
      );
    }
  });
};

// Update Product ProductStatus Se follow theo Quantity
let updateProduct = async (req, res) => {
  //Get ID Product
  const idProduct = req.query.idProduct;
  //Get Information Product
  const CategoryID = req.body.CategoryID;
  const ProductName = req.body.ProductName;
  const ProductPrice = req.body.ProductPrice;
  const Description = req.body.Description;
  const CreateDate = moment(req.body.CreateDate).format("YYYY-MM-DD");
  const Quantity = Number(req.body.Quantity);
  const ImageDetail = req.body.ImageDetail
    ? req.body.ImageDetail
    : "https://firebasestorage.googleapis.com/v0/b/demoweb-2d974.appspot.com/o/images%2Fproduct_packaging_pixel_perfect_color_line_icons_2-cardboard-512.png?alt=media&token=a9b4e229-efa4-49bd-9d3d-6cd0510d668c";

  //Check const ProductStatus= req.body.ProductStatus;
  const ProductStatus = Quantity > 0 ? "Còn Hàng" : "Hết Hàng";
  //Update Product
  let sql = `UPDATE Products
                SET CategoryID=?,ProductName=?,ProductPrice=?,Description=?,ProductStatus=?,CreateDate=?,Quantity=?,ImageDetail=?
                WHERE Products.ProductID=?`;
  let query = mysql.format(sql, [
    CategoryID,
    ProductName,
    ProductPrice,
    Description,
    ProductStatus,
    CreateDate,
    Quantity,
    ImageDetail,
    idProduct,
  ]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Cập nhật sản phẩm không thành công!" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Cập nhật sản phẩm thành công" });
    }
  });
};

//update Quatity Product
// Validate ben fontend // Moi lan an nui cong tru sẽ được đẩy lên đây// Cong hay Tru khong quan trong. Mien là cứ gửi cái số lên đây
let updateQuatityProduct = async (req, res) => {
  //Get ID Product
  const idProduct = req.query.idProduct;
  //Get Information Product
  const newQuantity = Number(req.body.Quantity);

  let sql = `SELECT Products.Quantity FROM Products WHERE Products.ProductID=?`;
  let query = mysql.format(sql, [idProduct]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Update Quatity Product Failed!" });
    } else {
      //Lay ID day vao Database cho bang Product
      const arr = await Array.apply(null, result);
      if (arr.length === 0) {
        // Chua co thi like
        return res.status(200).json({
          success: false,
          message: "No Exits Products !",
        });
      } else {
        const oldQuatity = Number(arr[0].Quantity);
        if (oldQuatity - newQuantity > 0) {
          // Mua trong khoang quatity
          const quatity = oldQuatity - newQuantity;
          let sqlUpdate = `UPDATE Products SET Quantity=? WHERE Products.ProductID=?`;
          let queryUpdate = mysql.format(sqlUpdate, [quatity, idProduct]);
          connectionDB.query(queryUpdate, async (err, result) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "Update Quatity Product Failed!",
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "Add Product To Cart Success!",
              });
            }
          });
        } else if (oldQuatity - newQuantity === 0) {
          // Mua cai het luon
          // Chi ton tai truong hop 0 thoi vi ben fontend da validate so luong roi
          let sqlUpdate = `UPDATE Products SET Quantity=0,ProductStatus="Hết Hàng" WHERE Products.ProductID=?`;
          let queryUpdate = mysql.format(sqlUpdate, [idProduct]);
          connectionDB.query(queryUpdate, async (err, result) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "Update Quatity Product Failed!",
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "Add Product To Cart Success!",
              });
            }
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "The product you want to buy is not enough",
          });
        }
      }
    }
  });
};

// Add new image ADD tung cai len mot
let addNewImageProduct = async (req, res) => {
  //Get ID Products
  const idProduct = req.body.ProductID;
  const urlImage = req.body.urlImage;
  //Convert listImage to array
  const empty = {
    ProductID: idProduct,
    urlImage: urlImage,
  };
  // Luu vao Database
  connectionDB.query(
    "INSERT INTO ImagesOfProduct SET ? ",
    empty,
    (err, result) => {
      if (err) {
        debug(err);
        return res
          .status(200)
          .json({ success: false, message: "Add New Image is Unsuccess!" });
      } else {
        // SELECT MAX(ImagesOfProduct.ImageID) AS MAX FROM ImagesOfProduct
        //Lay ID day vao Database cho bang Product
        let sql = `SELECT MAX(ImagesOfProduct.ImageID) AS MAX FROM ImagesOfProduct`;
        let query = mysql.format(sql);
        connectionDB.query(query, async (err, results) => {
          if (err) {
            return res.status(200).json({ success: false, message: err });
          } else {
            //Lay ID day vao Database cho bang Product
            const array = await Array.apply(null, results);
            // //Luu vao database
            return res.status(200).json({
              success: true,
              idImage: array[0],
            });
          }
        });
      }
    }
  );
};

let updateImageDetail = async (req, res) => {
  //Get ID Products
  const idImage = req.body.idImage;
  const urlImage = req.body.urlImage;
  let sql = `UPDATE ImagesOfProduct SET urlImage = ? WHERE ImageID = ?`;
  let query = mysql.format(sql, [urlImage, idImage]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res.status(200).json({
        success: false,
        message: "Add new image Faied",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Add new image Success!",
      });
    }
  });
};

//remove Image by ID
let removeImageProduct = async (req, res) => {
  //Get ID Products
  const idImage = req.query.idImage;
  //Delete Images
  let sql = `DELETE FROM ImagesOfProduct WHERE ImagesOfProduct.ImageID=?`;
  let query = mysql.format(sql, [idImage]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Remove Image Failed!" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Remove Image Success!" });
    }
  });
};

//Delete Product
let deleteProduct = async (req, res) => {
  //Get ID Products
  const idProduct = req.query.idProduct;
  //Delete Product
  let sql = `DELETE FROM Products WHERE Products.ProductID=?`;
  let query = mysql.format(sql, [idProduct]);
  connectionDB.query(query, async (err, result) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, message: "Remove Product Failed!" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Remove Product Success!" });
    }
  });
};

//Get Price,Quatity by ProductID From Cart: Phuc vu chuc nang tinh tien va validate so luong san pham trong cart
let getInfoProductFromCart = async (req, res) => {
  //Get ID Products
  // Khi mà ấn mua Hàng lưu vào cái session thì ta lưu luôn cả cái obj vào session được không ? Kiểu lưu ID Tên Giá Số Lượng Kho Hàng vào session luôn
  // debug(req.body.data);
  const array = req.body.data;
  debug(array[0]);
};

module.exports = {
  getinfobyid: getinfobyid,
  searchProduct: searchProduct,
  getinfosearchProduct: getinfosearchProduct,
  fulltextsearchProduct: fulltextsearchProduct,
  likeProduct: likeProduct,
  addNewProduct: addNewProduct,
  getProductsByCategory: getProductsByCategory,
  getProducts: getProducts,
  addNewImageProduct: addNewImageProduct,
  removeImageProduct: removeImageProduct,
  updateProduct: updateProduct,
  updateQuatityProduct: updateQuatityProduct,
  getProductsStatus: getProductsStatus,
  deleteProduct: deleteProduct,
  getListProductLike: getListProductLike,
  getInfoProductFromCart: getInfoProductFromCart,
  getProductAllByCategory: getProductAllByCategory,
  updateImageDetail: updateImageDetail,
};
