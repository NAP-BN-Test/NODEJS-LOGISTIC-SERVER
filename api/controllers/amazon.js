
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mUser = require('../tables/user');

module.exports = {
    amazonResponse: (req, res) => {//take this list for dropdown
        let body = req.body;


        console.log(body);
        
        // database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {



        //     if (body.all) {
        //         mUser(db).findAll().then(data => {
        //             var array = [];

        //             data.forEach(elm => {
        //                 array.push({
        //                     id: elm['ID'],
        //                     name: elm['Name'],
        //                 })
        //             });
        //             var result = {
        //                 status: Constant.STATUS.SUCCESS,
        //                 message: '',
        //                 array: array
        //             }
        //             res.json(result)
        //         })
        //     } else {
        //         mUser(db).findAll({ where: { ID: { [Op.ne]: body.userID } } }).then(data => {
        //             var array = [];

        //             data.forEach(elm => {
        //                 array.push({
        //                     id: elm['ID'],
        //                     name: elm['Name'],
        //                 })
        //             });
        //             var result = {
        //                 status: Constant.STATUS.SUCCESS,
        //                 message: '',
        //                 array: array
        //             }
        //             res.json(result)
        //         })
        //     }


        // })
    },

}