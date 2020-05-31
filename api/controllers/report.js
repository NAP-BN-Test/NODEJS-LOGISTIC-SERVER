const Result = require('../constants/result');
const Constant = require('../constants/constant');

const Op = require('sequelize').Op;

var moment = require('moment');

var database = require('../db');


module.exports = {

    getListReportByCampain: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var array = [
                    { name: 'Chiến dịch 1', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 2', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 3', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 4', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 5', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 6', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 7', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 8', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 9', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 10', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 }
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

    getListReportByUser: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var array = [
                    { name: 'Chiến dịch 1', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 2', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 3', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 4', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 5', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 6', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 7', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 8', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 9', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 },
                    { name: 'Chiến dịch 10', email: 'nap.cuongdk@gmail.com', startTime: '2020-05-30 14:00', endTime: '2020-06-30 14:00', receive: 5, cancel: 1 }
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

    getReportByCampainSummary: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var obj = {
                    name: 'Chuyển đổi số',
                    subject: 'Bây giờ chính là cơ hội tốt nhất để chuyển đổi số. Thời COVID-19',
                    contact: 'NAP',
                    timeStart: '23/05/2020 20:00',
                    timeEnd: '05/06/2020 20:00',
                    timeSend: '3 giây',
                    mailSend: '10 mail',
                    userSend: 'Le Minh Son',
                    percentOpen: 0.4,
                    percentClickLink: 0.4,
                    sendBack: 0
                }
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    obj
                }
                res.json(result);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })

    },

    getReportByCampainOpenMail: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var array = [
                    {date: '1/6', value: 0},
                    {date: '2/6', value: 1},
                    {date: '3/6', value: 0},
                    {date: '4/6', value: 3},
                    {date: '5/6', value: 0},
                    {date: '6/6', value: 0},
                    {date: '7/6', value: 0},
                    {date: '8/6', value: 0},
                    {date: '9/6', value: 0},
                    {date: '10/6', value: 0},
                    {date: '11/6', value: 0},
                    {date: '12/6', value: 0},
                    {date: '13/6', value: 0},
                    {date: '14/6', value: 0},
                    {date: '15/6', value: 0},
                    {date: '16/6', value: 0},
                    {date: '17/6', value: 0},
                    {date: '18/6', value: 0},
                    {date: '19/6', value: 0},
                    {date: '20/6', value: 0},
                    {date: '21/6', value: 0},
                    {date: '22/6', value: 0},
                    {date: '23/6', value: 0},
                    {date: '24/6', value: 0},
                    {date: '25/6', value: 0},
                    {date: '26/6', value: 0},
                    {date: '27/6', value: 0},
                    {date: '28/6', value: 0},
                    {date: '29/6', value: 0},
                    {date: '30/6', value: 0}
                ];

                var obj = {
                    total: 10,
                    totalOpen: 4,
                    totalOpenTwice: 2,
                    advangeOpen: 0.8,
                    percentOpen: 0.4
                }

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    obj
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