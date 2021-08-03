const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const authenticationRouter = require('./routes/authenticationRouter');
const modRouter = require('./routes/modRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const postRouter = require('./routes/postRouter');
const conversionRouter = require('./routes/conversionRouter');
const paymentRouter = require('./routes/paymentRouter');
const orderRouter = require('./routes/orderRouter');
const guessRouter = require('./routes/guessRouter');
const debug = console.log.bind(console);
//demo xem co lay dc data khi ko co token ko
const getdataDemoRouter = require('./routes/getdataDemoRouter');

var config = require('./config/configDB.js');
var connectionDB = mysql.createConnection(config.databaseOptions);
connectionDB.connect((err)=>{
    if(!err){
        debug("Connect mySQL success!");
        const PORT = process.env.PORT || 3001
        const server = express();
        // BodyParser to read body in header of request
        server.use(bodyParser.json());
        server.use(express.static('public'));
        // Cho phep ten mien dc truy cap vao origin
        server.use(cors());
        // Khai bao Routers
        productRouter(server);
        authenticationRouter(server);
        getdataDemoRouter(server);
        modRouter(server);
        userRouter(server);
        postRouter(server);
        conversionRouter(server);
        paymentRouter(server);
        orderRouter(server);
        guessRouter(server);

        server.listen(PORT,(error) => { 
            if(error){
                throw error;
            }else{
                console.log('Server listen on port 3001 ...');
            }
        });

    }else{
        debug(`Error with MySQL Connection : ${err.message}`);
    }
})