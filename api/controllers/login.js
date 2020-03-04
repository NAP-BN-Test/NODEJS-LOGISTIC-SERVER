const Result = require('../constants/result');
const Constant = require('../constants/constant');

var database = require('../db');

var mUser = require('../tables/user');

module.exports = {

    login: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mUser(db).findOne({
                            where: { Username: body.username, Password: body.password },
                            raw: true
                        }).then(data => {
                            var obj = {
                                id: data['ID'],
                                name: data['Name'],
                                username: data['Username'],
                                password: data['Password'],
                                phone: data['Phone'],
                                email: data['Email'],
                                role: data['Roles'],
                            }

                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                obj: obj
                            }

                            res.json(result);
                        }).catch(() => {
                            res.json(Result.LOGIN_FAIL)
                        })
                    })
                })
            } else {
                res.json(Result.SYS_ERROR_RESULT);
            }
        })
    },

}