
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mUser = require('../tables/user');

function checkUser(ip, dbName, username) {
    return new Promise((resolve, reject) => {
        database.serverDB(ip, dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mUser(db).findOne({ where: { Username: username } }).then(data => {
                            resolve(data['Roles'])
                        })
                    }).catch(err => {
                        reject();
                    })
                })
            } else {
                reject();
            }
        })
    })
}


module.exports = {
    getListUser: (req, res) => {//take this list for dropdown
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

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

                    }).catch(err => {
                        res.json(Result.SYS_ERROR_RESULT)
                    })
                })
            } else {
                res.json()
            }
        })
    },

    checkUser: (ip, dbName, username) => {
        return new Promise((resolve, reject) => {
            database.serverDB(ip, dbName).then(server => {
                if (server) {
                    database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                        db.authenticate().then(() => {
                            mUser(db).findOne({ where: { Username: username } }).then(data => {
                                resolve(data['Roles'])
                            })
                        }).catch(err => {
                            reject();
                        })
                    })
                } else {
                    reject();
                }
            })
        })
    },

    addUser: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

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
                }).catch(() => {
                    res.json(Result.SYS_ERROR_RESULT)
                })
            }
        })
    }

}