// const ftp = require('basic-ftp');
// const Duplex = require('stream').Duplex;

// const Constant = require('../constants/constant');
// const Result = require('../constants/result');

// var database = require('../db');

// var user = require('./user');

// var moment = require('moment');

// //table


// function bufferToStream(buffer) {
//     let stream = new Duplex();
//     stream.push(buffer);
//     stream.push(null);
//     return stream;
// }

// async function checkDir(path) {
//     const client = new ftp.Client()
//     client.ftp.verbose = true
//     try {
//         await client.access({
//             host: "163.44.192.123",
//             user: "ftpuser",
//             password: "123456a$",
//             secure: false
//         })
//         await client.ensureDir(path);
//     }
//     catch (err) { }
//     client.close()
// }

// async function uploadFile(source, path) {
//     const client = new ftp.Client()
//     client.ftp.verbose = true
//     try {
//         await client.access({
//             host: "163.44.192.123",
//             user: "ftpuser",
//             password: "123456a$",
//             secure: false
//         })

//         console.log(source);
//         console.log(path);

//         await client.uploadFrom(source, path);

//         client.close()
//         return Promise.resolve(1);
//     }
//     catch (err) {
//         client.close()
//         return Promise.resolve(0);
//     }
// }


// module.exports = {
//     uploadFile: async function (req, res) {
//         let body = req.body;

//         database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
//             try {

//                 console.log(body.uri);
                
//                 var path = "LogisticCrm/LOGISTIC_CRM/";
//                 checkDir(path);

//                 let buff = new Buffer(body.uri, 'base64');

//                 var source = bufferToStream(buff);
//                 var fileName = moment().valueOf() + i + ".png";


//                 uploadFile(source, path + fileName).then(data => {

//                     console.log(data);

//                     if (data == 1) {

//                         var result = {
//                             status: Constant.STATUS.SUCCESS,
//                             message: '',
//                             url: 'http://163.44.192.123:8552/LOGISTIC_CRM/' + fileName
//                         }
//                         res.json(result)
//                     }
//                 });
//             } catch (error) {
//                 console.log(error);
//                 res.json(Result.SYS_ERROR_RESULT)
//             }

//         }, error => {
//             res.json(error)
//         })
//     },


// }