
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

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



            checkUser(body.ip, body.dbName, body.username).then(role => {
                if (role == Constant.USER_ROLE.MANAGER) {
                    mUser(db).findOne({ where: { Username: body.regUsername } }).then(user => {
                        if (user) {
                            let result = {
                                status: Constant.STATUS.FAIL,
                                message: Constant.MESSAGE.INVALID_USER
                            }
                            res.json(result)
                        } else {
                            mUser(db).create({
                                Name: body.regName,
                                Username: body.regUsername,
                                Password: body.regPassword,
                                Phone: body.regPhone ? body.regPhone : "",
                                Email: body.regEmail ? body.regEmail : "",
                                Roles: Constant.USER_ROLE.STAFF
                            }).then(() => {
                                res.json(Result.ACTION_SUCCESS)
                            }).catch(() => {
                                res.json(Result.SYS_ERROR_RESULT);
                            })
                        }
                    })
                } else {
                    res.json(Result.NO_PERMISSION);
                }
            }).catch(() => {
                res.json(Result.SYS_ERROR_RESULT)
            })
        }).catch(() => {
            res.json(Result.SYS_ERROR_RESULT)
        })

    }

}