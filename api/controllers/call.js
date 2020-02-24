const Op = require('sequelize').Op;

const Constant = require('../constants/constant');
const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');
var user = require('../controllers/user');

var mUser = require('../tables/user');
var mContact = require('../tables/contact');
var mCompany = require('../tables/company');

var mCall = require('../tables/call');
var mAssociate = require('../tables/call-associate');

var rmAssociate = require('../tables/call-associate');
var rmComment = require('../tables/call-comment');


module.exports = {

    createCall: (req, res) => {
        let body = req.body;

        database.serverDB(body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        var call = mCall(db);
                        call.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });

                        call.create({
                            UserID: body.userID,
                            CompanyID: body.companyID,
                            ContactID: body.contactID,
                            State: body.outcomeType,
                            TimeStart: moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                            TimeRemind: body.timeRemind ? moment.utc(body.timeRemind).format('YYYY-MM-DD HH:mm:ss.SSS Z') : null,
                            TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                            Description: body.description,
                        }, { include: [{ model: mContact(db) }] }).then(data => {
                            if (body.listAssociate) {
                                let list = JSON.parse(body.listAssociate);
                                list.forEach(itm => {
                                    mAssociate(db).create({ ActivityID: data.dataValues.ID, UserID: itm });
                                });
                            }
                            var obj = {
                                id: data.dataValues.ID,
                                timeCreate: data.dataValues.TimeCreate,
                                timeRemind: data.dataValues.TimeRemind,
                                timeStart: data.dataValues.TimeStart,
                                contactID: data.dataValues.ContactID,
                                description: data.dataValues.Description,
                                state: data.dataValues.State,
                                activityType: Constant.ACTIVITY_TYPE.CALL,
                                listComment: []
                            };

                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                                obj: obj
                            }

                            res.json(result);
                        })
                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            }
        })
    },

    getAssociate: (req, res) => {
        let body = req.body;

        database.serverDB(body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mAssociate(db).findAll({ where: { ActivityID: body.callID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    callID: elm['ActivityID'],
                                    contactID: elm['ContactID'],
                                })
                            });

                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: array
                            }

                            res.json(result);
                        })
                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            }
        })
    },

    updateAssociate: (req, res) => {
        let body = req.body;

        database.serverDB(body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.state == Constant.STATUS.SUCCESS) {
                            mAssociate(db).create({ ActivityID: body.callID, ContactID: body.contactID }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        } else {
                            mAssociate(db).destroy({ where: { ActivityID: body.callID, ContactID: body.contactID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            }
        })
    },

    getListCall: (req, res) => {
        let body = req.body;

        database.serverDB(body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        var call = mCall(db);

                        call.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
                        call.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });
                        call.belongsTo(mCompany(db), { foreignKey: 'CompanyID', sourceKey: 'CompanyID' });

                        user.checkUser(body.username).then(role => {

                            let userFind = [];
                            if (body.userIDFind) {
                                userFind.push({ UserID: body.userIDFind })
                            }
                            if (role == Constant.USER_ROLE.STAFF) {
                                userFind.push({ UserID: body.userID })
                            }

                            let whereAll;
                            if (body.timeFrom) {
                                whereAll = {
                                    TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                    [Op.and]: userFind
                                };
                            } else {
                                whereAll = {
                                    [Op.and]: userFind
                                };
                            }

                            call.count({ where: whereAll }).then(all => {
                                call.findAll({
                                    where: whereAll,
                                    include: [
                                        { model: mUser(db), required: false },
                                        { model: mContact(db), required: false },
                                        { model: mCompany(db), required: false }
                                    ],
                                    order: [['TimeCreate', 'DESC']],
                                    offset: 12 * (body.page - 1),
                                    limit: 12
                                }).then(data => {
                                    let array = [];
                                    if (data) {
                                        data.forEach(item => {
                                            array.push({
                                                id: item.dataValues.ID,
                                                description: item.dataValues.Description,
                                                timeRemind: item.dataValues.TimeRemind,
                                                state: item.dataValues.State,

                                                createID: item.User.dataValues ? item.User.dataValues.ID : -1,
                                                createName: item.User.dataValues ? item.User.dataValues.Name : "",

                                                contactID: item.dataValues.Contact ? item.dataValues.Contact.dataValues.ID : -1,
                                                contactName: item.dataValues.Contact ? item.dataValues.Contact.dataValues.Name : "",

                                                companyID: item.dataValues.Company ? item.dataValues.Company.dataValues.ID : -1,
                                                companyName: item.dataValues.Company ? item.dataValues.Company.dataValues.Name : "",

                                                type: item.dataValues.Company ? 1 : item.dataValues.Contact ? 2 : 0,
                                                activityType: Constant.ACTIVITY_TYPE.CALL
                                            });
                                        });

                                        var result = {
                                            status: Constant.STATUS.SUCCESS,
                                            message: '',
                                            array, all
                                        }

                                        res.json(result);
                                    }
                                })
                            })
                        });

                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            }
        })
    },

    deleteCall: (req, res) => {
        let body = req.body;

        database.serverDB(body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.activityIDs) {
                            let listActivity = JSON.parse(body.activityIDs);
                            let listActivityID = [];
                            listActivity.forEach(item => {
                                listActivityID.push(Number(item + ""));
                            });
                            rmAssociate(db).destroy({ where: { ActivityID: { [Op.in]: listActivityID } } }).then(() => {
                                rmComment(db).destroy({ where: { ActivityID: { [Op.in]: listActivityID } } }).then(() => {
                                    mCall(db).destroy({ where: { ID: { [Op.in]: listActivityID } } }).then(() => {
                                        res.json(Result.ACTION_SUCCESS);
                                    })
                                })
                            })
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            }
        })
    },

}