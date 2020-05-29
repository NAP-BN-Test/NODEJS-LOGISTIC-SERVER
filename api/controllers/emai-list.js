const Result = require('../constants/result');
const Constant = require('../constants/constant');

const Op = require('sequelize').Op;

var moment = require('moment');

var database = require('../db');

var mUser = require('../tables/user');

module.exports = {

    getMaiList: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName).then(async db => {
            // const data = await mUser(db).findOne({
            //     where: { Username: body.username, Password: body.password }
            // })
            try {
                var array = {
                    id: data.ID,
                    name: data.Name,
                    username: data.Username,
                    password: data.Password,
                    phone: data.Phone,
                    email: data.Email,
                    role: data.Roles,
                }
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array
                }
                res.json(result);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })

    },

}