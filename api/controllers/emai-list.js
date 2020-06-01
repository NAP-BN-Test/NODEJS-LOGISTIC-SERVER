const Result = require('../constants/result');
const Constant = require('../constants/constant');

const Op = require('sequelize').Op;

var moment = require('moment');

var database = require('../db');


module.exports = {

    getMailList: async function (req, res) {
        let body = req.body;

        // console.log(req.sessionStore);

        // req.sessionStore.all((error, session) => {
        //     console.log(JSON.stringify(session));

        // })


        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            // const data = await mUser(db).findOne({
            //     where: { Username: body.username, Password: body.password }
            // })
            try {
                var array = [
                    { name: 'Danh sách 1', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 2', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 3', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 4', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 5', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 6', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 7', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 8', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 9', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' },
                    { name: 'Danh sách 10', owner: 'cuongdk', createTime: '2020-05-30 14:00', phone: '0398498960' }
                ]
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    count: 10
                }
                res.json(result);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })

    },

    getMailListDetail: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var array = [
                    { email: 'cuongdk1.nap@gmail.com', owner: 'cuongdk', createTime: '2020-05-30 14:00', mailCount: 5 },
                    { email: 'cuongdk2.nap@gmail.com', owner: 'cuongdk', createTime: '2020-05-30 14:00', mailCount: 5 },
                    { email: 'cuongdk3.nap@gmail.com', owner: 'cuongdk', createTime: '2020-05-30 14:00', mailCount: 1 },
                    { email: 'cuongdk4.nap@gmail.com', owner: 'cuongdk', createTime: '2020-05-30 14:00', mailCount: 10 },
                    { email: 'cuongdk5.nap@gmail.com', owner: 'cuongdk', createTime: '2020-05-30 14:00', mailCount: 7 },
                    { email: 'cuongdk6.nap@gmail.com', owner: 'cuongdk', createTime: '2020-05-30 14:00', mailCount: 1 },
                    { email: 'cuongdk7.nap@gmail.com', owner: 'cuongdk', createTime: '2020-05-30 14:00', mailCount: 7 }
                ]
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    count: 7
                }
                res.json(result);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })

    },

    getListMailCampain: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var array = [
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                    { name: 'Chuyển đổi số', subject: 'Chuyển đổi số thời COVID', owner: 'cuongdk', createTime: '2020-05-30 14:00', nearestSend: '2020-05-30 14:00' },
                ]
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    count: 8
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