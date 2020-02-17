
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mUser = require('../tables/user');


module.exports = {
    getListUser: (req, res) => {//take this list for dropdown
        let body = req.body;

        database.serverDB(body.username).then(server => {
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
                        console.log(err);

                        res.json(Result.SYS_ERROR_RESULT)
                    })
                })
            } else {
                res.json()
            }
        })
    },

    checkUser: (username) => {
        return new Promise((resolve, reject) => {
            database.serverDB(username).then(server => {
                if (server) {
                    database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                        db.authenticate().then(() => {
                            mUser(db).findOne().then(data => {
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

}