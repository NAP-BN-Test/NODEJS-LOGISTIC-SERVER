const Result = require('../constants/result');
const Constant = require('../constants/constant');

const Op = require('sequelize').Op;

var moment = require('moment');

var database = require('../db');

var mMailList = require('../tables/mail-list');
var mMailListDetail = require('../tables/mail-list-detail');

var mMailCampain = require('../tables/mail-campain');
var mMailSend = require('../tables/mail-send');
var mMailResponse = require('../tables/mail-response');

var mUser = require('../tables/user');

var nodemailer = require('nodemailer');

function sendEmail(body, idMailDetail, email, subject, ip, dbName) {

    let emailMarkup = body + `<img src="http://163.44.192.123:3302/crm/open_mail?ip=${ip}&dbName=${dbName}&idMailDetail=${idMailDetail}" height="1" width="1""/>`;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info.namanphu@gmail.com',
            pass: 'Nap123456a$'
        }
    });
    let mailOptions = {
        from: 'NAP LOCY',
        to: email,
        subject: subject,
        html: emailMarkup
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return 0;
        } else {
            return 1;
        }
    });
}



module.exports = {

    getMailList: async function (req, res) {
        let body = req.body;

        // console.log(req.sessionStore);

        // req.sessionStore.all((error, session) => {
        //     console.log(JSON.stringify(session));

        // })


        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {

                var mailList = mMailList(db);
                mailList.belongsTo(mUser(db), { foreignKey: 'OwnerID' })
                var mMailListData = await mailList.findAll({
                    include: { model: mUser(db) },
                    order: [['TimeCreate', 'DESC']],
                    offset: 12 * (body.page - 1),
                    limit: 12
                })
                var array = [];
                mMailListData.forEach(item => {
                    array.push({
                        id: Number(item.ID),
                        name: item.Name,
                        owner: item.User.Name,
                        createTime: item.TimeCreate,
                        phone: item.Phone
                    })
                })

                var mMailListCount = await mailList.count();
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    count: mMailListCount
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

    getMailListDetail: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var mailListDetail = mMailListDetail(db);
                mailListDetail.belongsTo(mUser(db), { foreignKey: 'OwnerID' });
                mailListDetail.hasMany(mMailSend(db), { foreignKey: 'MailListDetailID' });

                var mMailListDetailData = await mailListDetail.findAll({
                    where: { MailListID: body.mailListID },
                    include: [
                        { model: mUser(db) },
                        { model: mMailSend(db) }
                    ],
                    order: [['TimeCreate', 'DESC']],
                    offset: 12 * (body.page - 1),
                    limit: 12
                })

                var mMailListDetailCount = await mailListDetail.count({
                    where: { MailListID: body.mailListID }
                })
                var array = [];
                mMailListDetailData.forEach(item => {
                    array.push({
                        id: Number(item.ID),
                        email: item.Email,
                        owner: item.User.Name,
                        createTime: item.TimeCreate,
                        mailCount: item.MailSends.length
                    })
                })
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array,
                    count: mMailListDetailCount
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

                var mailCampain = mMailCampain(db);
                mailCampain.belongsTo(mUser(db), { foreignKey: 'OwnerID' });

                var mailCampainData = await mailCampain.findAll({
                    include: { model: mUser(db) },
                    order: [['TimeCreate', 'DESC']],
                    offset: 12 * (body.page - 1),
                    limit: 12
                });

                var mailCampainCount = await mailCampain.count();

                var array = [];
                mailCampainData.forEach(item => {
                    array.push({
                        id: Number(item.ID),
                        name: item.Name,
                        subject: item.Subject,
                        owner: item.User.Name,
                        createTime: item.TimeCreate,
                        nearestSend: '2020-05-30 14:00'
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
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })

    },

    addMailList: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

                var mailList = await mMailList(db).create({
                    Name: body.name,
                    OwnerID: Number(body.userID),
                    TimeCreate: now,
                    Phone: body.phone
                })

                if (body.listMail) {
                    let arrMail = JSON.parse(body.listMail);

                    let bulkCreate = [];
                    arrMail.forEach(mailItem => {
                        bulkCreate.push({
                            Email: mailItem,
                            OwnerID: body.userID,
                            TimeCreate: now,
                            MailListID: mailList.ID
                        })
                    })

                    await mMailListDetail(db).bulkCreate(bulkCreate);
                }

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                }
                res.json(result);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })
    },

    deleteMailList: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                if (body.listID) {
                    let listID = JSON.parse(body.listID);

                    await mMailListDetail(db).destroy({ where: { MailListID: { [Op.in]: listID } } });
                    await mMailList(db).destroy({ where: { ID: { [Op.in]: listID } } });
                }

                res.json(Result.ACTION_SUCCESS);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })
    },

    addMailListDetail: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

                let arrMail = JSON.parse(body.listMail);

                let bulkCreate = [];
                arrMail.forEach(mailItem => {
                    bulkCreate.push({
                        Email: mailItem,
                        OwnerID: Number(body.userID),
                        TimeCreate: now,
                        MailListID: Number(body.mailListID)
                    })
                })

                await mMailListDetail(db).bulkCreate(bulkCreate);

                res.json(Result.ACTION_SUCCESS);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })
    },

    deleteMailCampain: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                if (body.listID) {
                    let listID = JSON.parse(body.listID);
                    await mMailCampain(db).destroy({ where: { ID: { [Op.in]: listID } } });
                }

                res.json(Result.ACTION_SUCCESS);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })
    },

    deleteMailListDetail: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                if (body.listID) {
                    let listID = JSON.parse(body.listID);
                    await mMailListDetail(db).destroy({ where: { ID: { [Op.in]: listID } } });
                }

                res.json(Result.ACTION_SUCCESS);
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })
    },

    addMailCampain: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

                await mMailCampain(db).create({
                    Name: body.name,
                    Subject: body.subject,
                    TimeCreate: now,
                    TimeEnd: moment(body.endTime).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    OwnerID: Number(body.userID),
                    MailListID: Number(body.mailListID),
                    Body: body.body
                })

                var listMailDetail = await mMailListDetail(db).findAll({
                    where: { MailListID: body.mailListID }
                })

                if (listMailDetail.length > 0) {
                    listMailDetail.forEach(async (mailDetailItem, i) => {
                        sendEmail(body.body, mailDetailItem.ID, mailDetailItem.Email, body.subject, body.ip, body.dbName);
                        // if (sendMail == 1) {
                        //     await mMailSend(db).create({
                        //         MailListDetailID: mailDetailItem.ID,
                        //         TimeCreate: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        //     })
                        // }
                        // if (i == listMailDetail.length - 1) {
                        //     res.json(Result.ACTION_SUCCESS)
                        // }
                    });
                    let bulkCreate = [];
                    listMailDetail.forEach(mailItem => {
                        bulkCreate.push({
                            MailListDetailID: mailItem,
                            TimeCreate: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        })
                    })
                    await mMailSend(db).bulkCreate(bulkCreate);
                }
                else {
                    res.json(Result.NO_DATA_RESULT)
                }

            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })
    },

    addMailResponse: async function (req, res) {

        let query = req._parsedUrl.query;
        let params = query.split('&');
        let ip = params[0].split('=')[1];
        let dbName = params[1].split('=')[1];
        let idMailDetail = params[2].split('=')[1];

        database.checkServerInvalid(ip, dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {
            try {
                await mMailResponse(db).create({
                    MailListDetailID: idMailDetail,
                    TimeCreate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    Type: 1
                })

                res.json(Result.ACTION_SUCCESS)
            } catch (error) {
                res.json(Result.SYS_ERROR_RESULT)
            }

        }, error => {
            res.json(error)
        })
    },

    getMailListOption: async function (req, res) {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var mMailListData = await mMailList(db).findAll();
                var array = [];
                mMailListData.forEach(item => {
                    array.push({
                        id: Number(item.ID),
                        name: item.Name,
                    })
                })

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array
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


}