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
var mMailUnsubscribe = require('../tables/mail-unsubscribe');
var mMailInvalid = require('../tables/mail-invalid');

var mUser = require('../tables/user');

var mModules = require('../constants/modules')

/** Xử lý mảng có ngày trùng nhau gộp vào và cộng thêm 1 đơn vị */
function handleArray(array, reason) {
    if (!reason)
        var arraySort = [
            { email: array[0].email, date: array[0].date, value: 1, mailListID: array[0].mailListID }
        ]
    else
        var arraySort = [
            { email: array[0].email, date: array[0].date, value: 1, mailListID: array[0].mailListID, reason: array[0].reason }
        ]

    for (let i = 1; i < array.length; i++) {
        if (array[i].email == arraySort[0].email && array[i].date == arraySort[0].date) {
            arraySort[0].value += 1;
        } else {
            if (!reason)
                arraySort.unshift({ email: array[i].email, date: array[i].date, value: 1, mailListID: array[i].mailListID })
            else
                arraySort.unshift({ email: array[i].email, date: array[i].date, value: 1, mailListID: array[i].mailListID, reason: array[i].reason })
        }
    }
    return arraySort;
}

/** Xử lý mảng có ngày trùng nhau gộp vào và cộng thêm 1 đơn vị trả về mảng dùng cho biểu đồ */
function handleArrayChart(array, daies) {
    var arraySort = [
        { date: array[0].date, value: 1 }
    ]

    for (let i = 1; i < array.length; i++) {
        if (array[i].date == arraySort[0].date) {
            arraySort[0].value += 1;
        } else {
            arraySort.unshift({ date: array[i].date, value: 1 })
        }
    }

    var arr = [];
    for (let i = -Number(daies); i <= 0; i++) {
        let date = moment().add(i, 'days').format('DD/MM');
        let dateFind = arraySort.find(sortItem => {
            return sortItem.date == date;
        });
        if (dateFind) {
            arr.push(dateFind);
        } else {
            arr.push({ date, value: 0 });
        }
    }
    return arr;
}


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
                    order: [
                        ['TimeCreate', 'DESC']
                    ],
                    offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                    limit: Number(body.itemPerPage)
                });

                var mailCampainCount = await mailCampain.count();

                var array = [];
                mailCampainData.forEach(item => {
                    array.push({
                        id: item.ID,
                        name: item.Name,
                        email: item.MailList ? item.MailList.Name : "",
                        startTime: mModules.toDatetime(item.TimeCreate),
                        endTime: mModules.toDatetime(item.TimeEnd),
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
                mailCampain.hasOne(mMailSend(db), { foreignKey: 'MailCampainID' })

                var campainData = await mailCampain.findOne({
                    where: { ID: body.campainID },
                    attributes: ['ID', 'Name', 'Subject', 'TimeCreate', 'TimeEnd', 'MailListID'],
                    include: [{
                        model: mUser(db)
                    }, {
                        model: mMailSend(db),
                        order: [
                            ['TimeCreate', 'DESC']
                        ],
                    }]
                });

                var contactCount = await mMailListDetail(db).count({
                    where: { MailListID: campainData.MailListID }
                })
                var mailResponseCount = await mMailResponse(db).count({
                    where: { MailCampainID: body.campainID }
                });
                var mailSendCount = await mMailSend(db).count({
                    where: { MailCampainID: body.campainID }
                });
                var lastSend = await mMailSend(db).findOne({
                    where: { MailCampainID: body.campainID },
                    order: [
                        ['TimeCreate', 'DESC']
                    ],
                })

                var obj = {
                    name: campainData.Name,
                    subject: campainData.Subject,
                    timeStart: campainData.TimeCreate,
                    timeEnd: campainData.TimeEnd,
                    mailSend: mailSendCount,
                    userSend: campainData.User.Name,
                    totalOpen: mailResponseCount,

                    percentOpen: mailSendCount != 0 ? parseFloat(mailResponseCount / mailSendCount * 100).toFixed(0) + '%' : '0%',
                    contactCount,
                    lastSend: lastSend.TimeCreate,
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
                var mailListDetail = mMailListDetail(db);
                mailListDetail.belongsTo(mMailList(db), { foreignKey: 'MailListID' });

                var mailResponse = mMailResponse(db);
                mailResponse.belongsTo(mailListDetail, { foreignKey: 'MailListDetailID' });

                var mailResponseData = await mailResponse.findAll({
                    where: { MailCampainID: body.campainID },
                    attributes: ['ID', 'TimeCreate'],
                    include: {
                        model: mailListDetail,
                        attributes: ['Email'],
                        include: {
                            model: mMailList(db),
                            attributes: ['ID']
                        }
                    }
                });
                var arrayTable = [];
                mailResponseData.forEach(mailResponseDataItem => {
                    arrayTable.push({
                        id: mailResponseDataItem.ID,
                        date: moment.utc(mailResponseDataItem.TimeCreate).format("DD/MM"),
                        email: mailResponseDataItem.MailListDetail.Email,
                        mailListID: mailResponseDataItem.MailListDetail.MailList.ID ?
                            Number(mailResponseDataItem.MailListDetail.MailList.ID) : -1
                    })
                })

                var array = handleArrayChart(arrayTable, body.daies);

                var arrayTableSort = handleArray(arrayTable);

                var total = await mMailSend(db).count({
                    where: { MailCampainID: body.campainID }
                });
                var totalOpen = 0;
                var totalOpenTwice = 0;
                array.forEach(arrayItem => {
                    totalOpen = totalOpen + arrayItem.value;
                    if (arrayItem.value > 1) totalOpenTwice = totalOpenTwice += 1;
                })

                var obj = {
                    total,
                    totalOpen,
                    totalOpenTwice,
                    advangeOpen: parseFloat(totalOpen / total).toFixed(2),
                    percentOpen: parseFloat(totalOpen / total * 100).toFixed(0) + '%'
                }

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    obj,
                    arrayTableSort
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

    getReportByCampainInvalidMail: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var mailListDetail = mMailListDetail(db);
                mailListDetail.belongsTo(mMailList(db), { foreignKey: 'MailListID' });

                var mailInvalid = mMailInvalid(db);
                mailInvalid.belongsTo(mailListDetail, { foreignKey: 'MailListDetailID' });

                var mailInvalidData = await mailInvalid.findAll({
                    where: { MailCampainID: body.campainID },
                    attributes: ['ID', 'TimeCreate'],
                    include: {
                        model: mailListDetail,
                        attributes: ['Email'],
                        include: {
                            model: mMailList(db),
                            attributes: ['ID']
                        }
                    }
                });
                var arrayTable = [];
                mailInvalidData.forEach(mailInvalidDataItem => {
                    arrayTable.push({
                        id: mailInvalidDataItem.ID,
                        date: moment.utc(mailInvalidDataItem.TimeCreate).format("DD/MM"),
                        email: mailInvalidDataItem.MailListDetail.Email,
                        mailListID: mailInvalidDataItem.MailListDetail.MailList.ID ?
                            Number(mailInvalidDataItem.MailListDetail.MailList.ID) : -1
                    })
                })

                var array = handleArrayChart(arrayTable, body.daies);

                var arrayTableSort = handleArray(arrayTable);

                var total = await mMailSend(db).count({
                    where: { MailCampainID: body.campainID }
                });
                var totalOpen = 0;
                var totalOpenTwice = 0;
                array.forEach(arrayItem => {
                    totalOpen = totalOpen + arrayItem.value;
                    if (arrayItem.value > 1) totalOpenTwice = totalOpenTwice += 1;
                })

                var obj = {
                    total,
                    totalOpen,
                    totalOpenTwice,
                    advangeOpen: parseFloat(totalOpen / total).toFixed(2),
                    percentOpen: parseFloat(totalOpen / total * 100).toFixed(0) + '%'
                }

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    obj,
                    arrayTableSort
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

    getReportByCampainUnsubscribeMail: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var mailListDetail = mMailListDetail(db);
                mailListDetail.belongsTo(mMailList(db), { foreignKey: 'MailListID' });

                var mailUnsubscribe = mMailUnsubscribe(db);
                mailUnsubscribe.belongsTo(mailListDetail, { foreignKey: 'MailListDetailID' });

                var mailUnsubscribeData = await mailUnsubscribe.findAll({
                    where: { MailCampainID: body.campainID },
                    attributes: ['ID', 'TimeCreate', 'Reason'],
                    include: {
                        model: mailListDetail,
                        attributes: ['Email'],
                        include: {
                            model: mMailList(db),
                            attributes: ['ID']
                        }
                    }
                });
                var arrayTable = [];
                mailUnsubscribeData.forEach(mailUnsubscribeDataItem => {
                    arrayTable.push({
                        id: mailUnsubscribeDataItem.ID,
                        date: moment.utc(mailUnsubscribeDataItem.TimeCreate).format("DD/MM"),
                        email: mailUnsubscribeDataItem.MailListDetail.Email,
                        reason: mailUnsubscribeDataItem.Reason,
                        mailListID: mailUnsubscribeDataItem.MailListDetail.MailList.ID ?
                            Number(mailUnsubscribeDataItem.MailListDetail.MailList.ID) : -1
                    })
                })

                var array = handleArrayChart(arrayTable, body.daies);

                var arrayTableSort = handleArray(arrayTable, true);

                var total = await mMailSend(db).count({
                    where: { MailCampainID: body.campainID }
                });
                var totalOpen = 0;
                var totalOpenTwice = 0;
                array.forEach(arrayItem => {
                    totalOpen = totalOpen + arrayItem.value;
                    if (arrayItem.value > 1) totalOpenTwice = totalOpenTwice += 1;
                })

                var obj = {
                    total,
                    totalOpen,
                    totalOpenTwice,
                    advangeOpen: parseFloat(totalOpen / total).toFixed(2),
                    percentOpen: parseFloat(totalOpen / total * 100).toFixed(0) + '%'
                }

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    obj,
                    arrayTableSort
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