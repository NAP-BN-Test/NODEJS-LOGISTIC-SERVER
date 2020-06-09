const Result = require('../constants/result');
const Constant = require('../constants/constant');

const Op = require('sequelize').Op;
const sequelize = require('sequelize');

var moment = require('moment');

var database = require('../db');

var mMailList = require('../tables/mail-list');
var mMailListDetail = require('../tables/mail-list-detail');

var mMailCampain = require('../tables/mail-campain');
var mMailSend = require('../tables/mail-send');
var mMailResponse = require('../tables/mail-response');

var mUser = require('../tables/user');


module.exports = {

    getListReportByCampain: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {

                var mailCampain = mMailCampain(db);
                mailCampain.belongsTo(mMailList(db), { foreignKey: 'MailListID' });

                let where = [];
                if (body.userIDFind) {
                    where = { OwnerID: body.userIDFind }
                }
                var mailCampainData = await mailCampain.findAll({
                    where: where,
                    include: { model: mMailList(db) },
                    order: [['TimeCreate', 'DESC']],
                    offset: 12 * (body.page - 1),
                    limit: 12
                });

                var mailCampainCount = await mailCampain.count();

                var array = [];
                mailCampainData.forEach(item => {
                    array.push({
                        id: item.ID,
                        name: item.Name,
                        email: item.MailList ? item.MailList.Name : "",
                        startTime: item.TimeCreate,
                        endTime: item.TimeEnd,
                        receive: item.SendCount
                    })
                })

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    count: mailCampainCount
                }
                res.json(result);
            } catch (error) {
                console.log(error);
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
                var mailCampain = mMailCampain(db);
                mailCampain.belongsTo(mUser(db), { foreignKey: 'OwnerID' })
                var campainData = await mailCampain.findOne({
                    where: { ID: body.campainID },
                    include: { model: mUser(db) }
                });

                var mailListDetailData = await mMailListDetail(db).findAll({
                    where: { MailListID: campainData.MailListID },
                    attributes: ['ID'],
                    raw: true
                });
                var listMailListDetailID = [];
                mailListDetailData.forEach(item => {
                    listMailListDetailID.push(Number(item.ID));
                })

                var mailResponseCount = await mMailResponse(db).count({
                    where: {
                        MailListDetailID: { [Op.in]: listMailListDetailID },
                        MailCampainID: campainData.ID
                    }
                });
                var mailSendCount = await mMailSend(db).count({
                    where: {
                        MailListDetailID: { [Op.in]: listMailListDetailID },
                        MailCampainID: campainData.ID
                    }
                });

                var obj = {
                    name: campainData.Name,
                    subject: campainData.Subject,
                    timeStart: campainData.TimeCreate,
                    timeEnd: campainData.TimeEnd,
                    mailSend: mailSendCount,
                    userSend: campainData.User.Name,
                    percentOpen: mailSendCount != 0 ? parseFloat(mailResponseCount / mailSendCount * 100).toFixed(0) + '%' : '0%'
                }
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    obj
                }
                res.json(result);
            } catch (error) {
                console.log(error);
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

                var mailCampain = mMailCampain(db);
                mailCampain.belongsTo(mUser(db), { foreignKey: 'OwnerID' })
                var campainData = await mailCampain.findOne({
                    where: { ID: body.campainID },
                    include: { model: mUser(db) }
                });

                var mailListDetailData = await mMailListDetail(db).findAll({
                    where: { MailListID: campainData.MailListID },
                    attributes: ['ID'],
                    raw: true
                });
                var listMailListDetailID = [];
                mailListDetailData.forEach(item => {
                    listMailListDetailID.push(Number(item.ID));
                })

                var arrMail = await mMailResponse(db).findAll({
                    where: {
                        MailListDetailID: { [Op.in]: listMailListDetailID },
                        MailCampainID: campainData.ID
                    }
                });

                var arrMailCacu = []
                arrMail.forEach(mailItem => {
                    arrMailCacu.push({
                        id: mailItem.ID,
                        mailListDetailID: mailItem.MailListDetailID,
                        timeCreate: moment.utc(mailItem.TimeCreate).format("DD/MM")
                    })
                })

                var arrOpenEachDay = arrMailCacu.reduce((r, a) => {
                    r[a.timeCreate] = [...r[a.timeCreate] || [], a];
                    return r;
                }, {});

                var arrOpenTwice = arrMailCacu.reduce((r, a) => {
                    r[a.mailListDetailID] = [...r[a.mailListDetailID] || [], a];
                    return r;
                }, {});

                var sortArrOpenEachDay = Object.keys(arrOpenEachDay).map(k => {
                    return { date: k, value: arrOpenEachDay[k].length };
                });

                var sortArrOpenTwice = Object.keys(arrOpenTwice).map(k => {
                    return { date: k, value: arrOpenTwice[k].length };
                });
                var countArrOpenTwice = sortArrOpenTwice.filter(openTwiceItem => {
                    return openTwiceItem.value > 1;
                })

                var array = [];
                for (let i = -Number(body.daies); i <= 0; i++) {
                    let date = moment().add(i, 'days').format('DD/MM');
                    let dateFind = sortArrOpenEachDay.find(openEachDayItem => {
                        return openEachDayItem.date == date;
                    });
                    if (dateFind) {
                        array.push(dateFind);
                    } else {
                        array.push({ date, value: 0 });
                    }
                }

                var mailSendCount = await mMailSend(db).count({
                    where: {
                        MailListDetailID: { [Op.in]: listMailListDetailID },
                        MailCampainID: campainData.ID
                    }
                });

                var sumSortArrOpenTwice = sortArrOpenTwice.reduce(function (a, b) {
                    return a + b.value;
                }, 0);

                var obj = {
                    total: mailSendCount,
                    totalOpen: arrMail.length,
                    totalOpenTwice: countArrOpenTwice.length,
                    advangeOpen: sortArrOpenTwice.length != 0 ? parseFloat(sumSortArrOpenTwice / sortArrOpenTwice.length).toFixed(2) : 0,
                    percentOpen: parseFloat(sortArrOpenTwice.length / mailSendCount * 100).toFixed(0) + '%'
                }

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    obj
                }
                res.json(result);

            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })

    },

    getReportByUserSummary: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var obj = {
                    timeCreate: '23/05/2020 20:00',
                    timeLogin: '05/06/2020 20:00',
                    nearestSend: '05/06/2020 20:00',
                    contactCount: 3,
                    autoSend: 0,
                    campainMailSend: 4,
                    mailSend: 12,
                    openMailCount: 1,
                    userOpenMailCount: 1,
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

    getReportByUserMailSend: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var array = [
                    { date: '1/6', value: 0 },
                    { date: '2/6', value: 1 },
                    { date: '3/6', value: 0 },
                    { date: '4/6', value: 3 },
                    { date: '5/6', value: 0 },
                    { date: '6/6', value: 5 },
                    { date: '7/6', value: 0 },
                    { date: '8/6', value: 0 },
                    { date: '9/6', value: 0 },
                    { date: '10/6', value: 0 },
                    { date: '11/6', value: 0 },
                    { date: '12/6', value: 0 },
                    { date: '13/6', value: 0 },
                    { date: '14/6', value: 0 },
                    { date: '15/6', value: 0 }
                ];

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