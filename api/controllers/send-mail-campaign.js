const Constant = require('../constants/constant');
const Op = require('sequelize').Op;
const Result = require('../constants/result');
var moment = require('moment');
var database = require('../db');
var mMailResponse = require('../tables/mail-response');
var mMailListDetail = require('../tables/mail-list-detail');
var mMailList = require('../tables/mail-list');
var mMailCampain = require('../tables/mail-campain');
var mContact = require('../tables/contact');

let mUser = require('../tables/user');
const result = require('../constants/result');
module.exports = {
    getListMailCampaign: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {
                var array = [];
                var mailList = mMailList(db);
                mailList.belongsTo(mUser(db), { foreignKey: 'OwnerID' })
                mailList.hasMany(mMailListDetail(db), { foreignKey: 'MailListID' })
                var listMailCampaign = [];
                await mContact(db).findAll({
                    where: { CompanyID: body.CompanyID }
                }).then(async contact => {
                    for (var i = 0; i < contact.length; i++) {
                        await mMailListDetail(db).findOne({ where: { Email: contact[i].Email } }).then(async detail => {
                            if (detail)
                                if (detail.MailListID) {
                                    await mMailCampain(db).findAll({ where: { MailListID: detail.MailListID } }).then(mailCampaign => {
                                        mailCampaign.forEach(item => {
                                            listMailCampaign.push(item.ID);
                                        })

                                    })
                                }
                        })
                    }
                })
                await mMailCampain(db).findAll(
                    {
                        where: {
                            [Op.and]: [
                                { Type: 'MailList' },
                                { ID: { [Op.in]: listMailCampaign } }
                            ]
                        }
                    }
                ).then(async data => {
                    for (var i = 0; i < data.length; i++) {
                        var totalOpen = await mMailResponse(db).count({
                            where: {
                                MailCampainID: data[i].ID,
                                Type: Constant.MAIL_RESPONSE_TYPE.OPEN
                            }
                        });
                        var totalUnsubscribe = await mMailResponse(db).count({
                            where: {
                                MailCampainID: data[i].ID,
                                Type: Constant.MAIL_RESPONSE_TYPE.UNSUBSCRIBE
                            }
                        });
                        var totalSend = await mMailResponse(db).count({
                            where: {
                                MailCampainID: data[i].ID,
                                Type: Constant.MAIL_RESPONSE_TYPE.SEND
                            }
                        });
                        var emailArray = '';
                        var countEmail = 0;
                        if (data[i].MailListID) {
                            await mMailList(db).findOne({
                                where: { ID: data[i].MailListID }
                            }).then(async data => {
                                var detail = await mMailListDetail(db).findAll({
                                    where: { MailListID: data.ID },
                                })
                                for (var i = 0; i < detail.length; i++) {
                                    if (detail[i].Email) {
                                        countEmail += 1;
                                        emailArray += detail[i].Email + ', ';
                                    }
                                }
                            })
                            var user = await mUser(db).findOne({
                                where: { ID: body.userID }
                            })
                            array.push({
                                name: data[i].Name,
                                subject: data[i].Subject,
                                mailSend: user.Email,
                                timeCreate: data[i].TimeCreate,
                                emailArray: {
                                    totalEmail: countEmail,
                                    listEmail: emailArray.substring(0, emailArray.length - 2)
                                },
                                totalOpenings: totalSend ? totalSend : 0,
                                SecondOpeners: totalOpen ? totalOpen : 0,
                                numberEmailUnsubscribe: totalUnsubscribe ? totalUnsubscribe : 0,
                            })
                        }
                    }
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        array,
                    }
                    res.json(result);
                })

            } catch (error) {
                console.log(error);
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: Constant.MESSAGE.DATA_NOT_FOUND,
                }
                res.json(result);
            }
        })
    },
    getListMailMerge: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            try {

                var array = [];
                var mailList = mMailList(db);
                mailList.belongsTo(mUser(db), { foreignKey: 'OwnerID' })
                mailList.hasMany(mMailListDetail(db), { foreignKey: 'MailListID' })
                var listMailCampaign = [];
                await mContact(db).findAll({
                    where: { CompanyID: body.CompanyID }
                }).then(async contact => {
                    for (var i = 0; i < contact.length; i++) {
                        await mMailListDetail(db).findOne({ where: { Email: contact[i].Email } }).then(async detail => {
                            if (detail)
                                if (detail.MailListID) {
                                    await mMailCampain(db).findAll({ where: { MailListID: detail.MailListID } }).then(mailCampaign => {
                                        mailCampaign.forEach(item => {
                                            listMailCampaign.push(item.ID);
                                        })

                                    })
                                }
                        })
                    }
                })
                var user = await mUser(db).findOne({
                    where: { ID: body.userID }
                })
                await
                    await mMailCampain(db).findAll(
                        {
                            where: {
                                [Op.and]: [
                                    { Type: 'MailMerge' },
                                    { ID: { [Op.in]: listMailCampaign } }

                                ]
                            }
                        }
                    ).then(async data => {
                        for (var i = 0; i < data.length; i++) {
                            var totalOpen = await mMailResponse(db).count({
                                where: {
                                    MailCampainID: data[i].ID,
                                    Type: Constant.MAIL_RESPONSE_TYPE.OPEN
                                }
                            });
                            var totalSend = await mMailResponse(db).count({
                                where: {
                                    MailCampainID: data[i].ID,
                                    Type: Constant.MAIL_RESPONSE_TYPE.SEND
                                }
                            });
                            array.push({
                                mailmergeName: data[i].Name,
                                dateAndTime: data[i].TimeCreate,
                                email: user.Email,
                                totalOpenings: totalSend ? totalSend : 0,
                                SecondOpeners: totalOpen ? totalOpen : 0,
                                status: 'Send',
                                note: data[i].Subject,
                            })
                        }
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: '',
                            array,
                        }
                        res.json(result);
                    })

            } catch (error) {
                console.log(error);
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: Constant.MESSAGE.DATA_NOT_FOUND,
                }
                res.json(result);
            }
        })
    }
}