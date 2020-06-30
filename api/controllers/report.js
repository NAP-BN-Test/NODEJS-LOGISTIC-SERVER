const Result = require('../constants/result');
const Constant = require('../constants/constant');

const Op = require('sequelize').Op;
const sequelize = require('sequelize');

var moment = require('moment');

var database = require('../db');

var mMailList = require('../tables/mail-list');
var mMailListDetail = require('../tables/mail-list-detail');

var mMailCampain = require('../tables/mail-campain');
var mMailResponse = require('../tables/mail-response');

var mUser = require('../tables/user');

var mModules = require('../constants/modules');

/** Xử lý mảng có ngày trùng nhau gộp vào và cộng thêm 1 đơn vị */
function handleArray(array, body, reason) {

    if (body.timeType == Constant.TIME_TYPE.HOUR) {

    } else if (body.timeType == Constant.TIME_TYPE.DAY) {

    } else if (body.timeType == Constant.TIME_TYPE.DATE) {
        if (array.length > 0) {
            var arrayHandleTime = [];
            array.forEach(item => {
                arrayHandleTime.push({
                    id: item.id,
                    email: item.email,
                    reason: item.reason,
                    mailListID: item.mailListID,
                    time: moment(item.time).format('DD/MM/YYYY')
                })
            });

            if (!reason)
                var arraySort = [
                    { email: arrayHandleTime[0].email, time: arrayHandleTime[0].time, value: 1, mailListID: arrayHandleTime[0].mailListID }
                ]
            else
                var arraySort = [
                    { email: arrayHandleTime[0].email, time: arrayHandleTime[0].time, value: 1, mailListID: arrayHandleTime[0].mailListID, reason: arrayHandleTime[0].reason }
                ]

            for (let i = 1; i < array.length; i++) {
                if (arrayHandleTime[i].email == arraySort[0].email && arrayHandleTime[i].time == arraySort[0].time) {
                    arraySort[0].value += 1;
                } else {
                    if (!reason)
                        arraySort.unshift({ email: arrayHandleTime[i].email, time: arrayHandleTime[i].time, value: 1, mailListID: arrayHandleTime[i].mailListID })
                    else
                        arraySort.unshift({ email: arrayHandleTime[i].email, time: arrayHandleTime[i].time, value: 1, mailListID: arrayHandleTime[i].mailListID, reason: arrayHandleTime[i].reason })
                }
            }
            return arraySort;
        } else return [];
    } else if (body.timeType == Constant.TIME_TYPE.MONTH) {

    }

}

/** Xử lý mảng có ngày trùng nhau gộp vào và cộng thêm 1 đơn vị trả về mảng dùng cho biểu đồ */
function handleArrayChart(array, body) {

    if (body.timeType == Constant.TIME_TYPE.HOUR) {

    } else if (body.timeType == Constant.TIME_TYPE.DAY) {

    } else if (body.timeType == Constant.TIME_TYPE.DATE) {
        var arraySort = [];
        if (array.length > 0) {
            var arrayHandleTime = [];
            array.forEach(item => {
                arrayHandleTime.push({
                    id: item.id,
                    email: item.email,
                    reason: item.reason,
                    mailListID: item.mailListID,
                    time: moment(item.time).format('DD/MM')
                })
            });

            var arraySort = [
                { time: arrayHandleTime[0].time, value: 1 }
            ]

            for (let i = 1; i < arrayHandleTime.length; i++) {
                if (arrayHandleTime[i].time == arraySort[0].time) {
                    arraySort[0].value += 1;
                } else {
                    arraySort.unshift({ time: arrayHandleTime[i].time, value: 1 })
                }
            }
        }

        var daies = parseFloat(((moment(body.timeTo).valueOf() - moment(body.timeFrom).valueOf()) / 86400000) + "").toFixed(0);
        var arr = [];
        for (let i = -Number(daies); i <= 0; i++) {
            let time = moment().add(i, 'days').format('DD/MM');
            let timeFind = arraySort.find(sortItem => {
                return sortItem.time == time;
            });
            if (timeFind) {
                arr.push(timeFind);
            } else {
                arr.push({ time, value: 0 });
            }
        }
        return arr;
    } else if (body.timeType == Constant.TIME_TYPE.MONTH) {

    }
}

/** Xử lý lấy ra lý do nhiều nhất */
function handleReasonUnsubcribe(array) {
    if (array.length > 0) {
        var arraySort = [
            { reason: array[0].reason, value: 1 }
        ]
        for (let i = 1; i < array.length; i++) {
            if (array[i].reason == arraySort[0].reason) {
                arraySort[0].value += 1;
            } else {
                arraySort.unshift({ reason: array[i].reason, value: 1 })
            }
        }
        arraySort = arraySort.sort((a, b) => {
            return b.value - a.value
        });

        return arraySort[0].reason;
    } else return "";
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
                mailCampain.hasOne(mMailResponse(db), { foreignKey: 'MailCampainID' })

                var campainData = await mailCampain.findOne({
                    where: { ID: body.campainID },
                    attributes: ['ID', 'Name', 'Subject', 'TimeCreate', 'TimeEnd', 'MailListID'],
                    include: [{
                        model: mUser(db)
                    }, {
                        model: mMailResponse(db),
                        order: [
                            ['TimeCreate', 'DESC']
                        ],
                    }]
                });

                var totalEmail = await mMailResponse(db).count({
                    where: { MailCampainID: body.campainID },
                    distinct: true,
                    col: 'MailListDetailID'
                });
                var nearestSend = await mMailResponse(db).findOne({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.SEND
                    },
                    order: [
                        ['TimeCreate', 'DESC']
                    ],
                    attributes: ['TimeCreate'],
                    raw: true
                });
                var startSend = await mMailResponse(db).findOne({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.SEND
                    },
                    order: [
                        ['TimeCreate', 'ASC']
                    ],
                    attributes: ['TimeCreate'],
                    raw: true
                });
                var totalSend = await mMailResponse(db).count({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.SEND
                    }
                });
                var totalOpen = await mMailResponse(db).count({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.OPEN
                    }
                });
                var totalOpenDistinct = await mMailResponse(db).count({ // Tổng số email được mở bởi mỗi email và không trùng nhau
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.OPEN
                    },
                    distinct: true,
                    col: 'MailListDetailID'
                });
                var totalClickLink = await mMailResponse(db).count({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.CLICK_LINK
                    }
                });
                var totalUnsubscribe = await mMailResponse(db).count({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.UNSUBSCRIBE
                    }
                });
                var totalInvalid = await mMailResponse(db).count({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.INVALID
                    }
                });

                var obj = {
                    name: campainData.Name,
                    subject: campainData.Subject,
                    totalEmail,
                    nearestSend,
                    startSend,
                    userSend: campainData.User.Name,
                    totalSend,
                    totalOpen,
                    totalClickLink,
                    totalInvalid,
                    totalUnsubscribe,

                    percentType: parseFloat(totalOpenDistinct / totalEmail * 100).toFixed(0) + '%',
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

    getReportByCampainMailType: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var mailListDetail = mMailListDetail(db);
                mailListDetail.belongsTo(mMailList(db), { foreignKey: 'MailListID' });

                var mailResponse = mMailResponse(db);
                mailResponse.belongsTo(mailListDetail, { foreignKey: 'MailListDetailID' });

                var mWhere;
                if (body.timeFrom) {
                    mWhere = {
                        TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                        MailCampainID: body.campainID,
                        Type: body.mailType
                    }
                } else {
                    mWhere = {
                        MailCampainID: body.campainID,
                        Type: body.mailType
                    }
                }
                var mailResponseData = await mailResponse.findAll({
                    where: mWhere,
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
                mailResponseData.forEach(mailResponseDataItem => {
                    arrayTable.push({
                        id: mailResponseDataItem.ID,
                        time: mailResponseDataItem.TimeCreate,
                        email: mailResponseDataItem.MailListDetail.Email,
                        reason: mailResponseDataItem.Reason ? mailResponseDataItem.Reason : "",
                        mailListID: mailResponseDataItem.MailListDetail.MailList.ID ?
                            Number(mailResponseDataItem.MailListDetail.MailList.ID) : -1
                    })
                })

                var array = handleArrayChart(arrayTable, body);

                var arrayTableSort = handleArray(arrayTable, body, body.mailType == Constant.MAIL_RESPONSE_TYPE.UNSUBSCRIBE);

                var totalEmail = await mMailResponse(db).count({ // Tổng số email đã thao tác với chiến dịch mà không trùng nhau
                    where: { MailCampainID: body.campainID },
                    distinct: true,
                    col: 'MailListDetailID'
                });

                var totalTypeDistinct = await mMailResponse(db).count({ // Tổng số email tương ứng với các loại và không trùng nhau
                    where: {
                        MailCampainID: body.campainID,
                        Type: body.mailType
                    },
                    distinct: true,
                    col: 'MailListDetailID'
                });

                var totalType = 0; // tổng số lần cho mỗi loại mail response
                var totalTypeTwice = 0; // tổng số loại mail response thao tác trên 2 lần
                var mainReason = handleReasonUnsubcribe(arrayTable); // Lý do nhiều nhất nếu là loại unsubscribe

                array.forEach(arrayItem => {
                    totalType = totalType + arrayItem.value;
                    if (arrayItem.value > 1) totalTypeTwice = totalTypeTwice += 1;
                });

                // BC gửi mail
                var nearestSend = await mMailResponse(db).findOne({
                    where: {
                        MailCampainID: body.campainID,
                        Type: Constant.MAIL_RESPONSE_TYPE.SEND
                    },
                    order: [
                        ['TimeCreate', 'DESC']
                    ],
                    attributes: ['TimeCreate'],
                    raw: true
                });

                var obj = {
                    totalEmail,
                    totalType,
                    totalTypeTwice,
                    advangeType: parseFloat(totalTypeDistinct / totalEmail).toFixed(2), // tỉ lệ là số mail response / tổng số email của chiến dịch
                    nearestSend: nearestSend ? nearestSend.TimeCreate : null,
                    mainReason
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