
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');
var moment = require('moment');

var mUser = require('../tables/user');

module.exports = {
    getListUser: (req, res) => {//take this list for dropdown
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            if (body.all) {
                mUser(db).findAll().then(data => {
                    var array = [];

                    data.forEach(elm => {
                        array.push({
                            id: elm['ID'],
                            name: elm['Name'],
                        })
                    });
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        array: array
                    }
                    res.json(result)
                })
            } else {
                mUser(db).findAll({ where: { ID: { [Op.ne]: body.userID } } }).then(data => {
                    var array = [];

                    data.forEach(elm => {
                        array.push({
                            id: elm['ID'],
                            name: elm['Name'],
                        })
                    });
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        array: array
                    }
                    res.json(result)
                })
            }


        })
    },

    checkUser: async function (ip, dbName, username) {
        var db = await database.checkServerInvalid(ip, dbName, '00a2152372fa8e0e62edbb45dd82831a');
        try {
            var data = await mUser(db).findOne({ where: { Username: username } })
            return Promise.resolve(data.Roles);
        } catch (error) {
            return Promise.reject(error)
        }
    },

    updateEmailUser: async function (ip, dbName, userID, email) {
        var db = await database.checkServerInvalid(ip, dbName, '00a2152372fa8e0e62edbb45dd82831a');
        try {
            var data = await mUser(db).update({ Email: email }, { where: { ID: userID } })
            return Promise.resolve(data.Roles);
        } catch (error) {
            return Promise.reject(error)
        }
    },

    addUser: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {

            try {
                var role = await mUser(db).findOne({
                    where: { ID: body.userID },
                    attributes: ['Roles']
                });
                if (role) {
                    var result;
                    if (role.Roles == Constant.USER_ROLE.MANAGER) {
                        var userExist = await mUser(db).findOne({
                            where: { Username: body.regUsername }
                        });
                        if (userExist) {
                            result = {
                                status: Constant.STATUS.FAIL,
                                message: Constant.MESSAGE.INVALID_USER
                            }
                            res.json(result);
                        } else {
                            var userCreate = await mUser(db).create({
                                Name: body.regName,
                                Username: body.regUsername,
                                Password: body.regPassword,
                                Phone: body.regPhone ? body.regPhone : "",
                                Email: body.regEmail ? body.regEmail : "",
                                Roles: Constant.USER_ROLE.STAFF,
                                TimeCreate: moment().format("YYYY-MM-DD HH:mm:ss.SSS")
                            });
                            if (userCreate)
                                res.json(Result.ACTION_SUCCESS)
                            else
                                res.json(Result.INVALID_USER)
                        }
                    }
                } else {
                    res.json(Result.NO_PERMISSION);
                }
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }
        }).catch(() => {
            res.json(Result.SYS_ERROR_RESULT)
        })

    }

}