const Op = require('sequelize').Op;

const Constant = require('../constants/constant');
const Result = require('../constants/result');

var moment = require('moment');

var user = require('../controllers/user');
var database = require('../db');

var mMeetAttend = require('../tables/meet-attend');
var mMeet = require('../tables/meet');
var mAssociate = require('../tables/meet-associate');


var rmAssociate = require('../tables/meet-associate');
var rmComment = require('../tables/meet-comment');
var rmAttend = require('../tables/meet-attend');
var rmMeetContact = require('../tables/meet-contact');

var mUser = require('../tables/user');
var mContact = require('../tables/contact');
var mCompany = require('../tables/company');


module.exports = {

    createMeet: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mMeet(db).create({
                            UserID: body.userID,
                            CompanyID: body.companyID,
                            ContactID: body.contactID,
                            Duration: body.duration,
                            TimeStart: moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                            TimeRemind: body.timeRemind ? moment.utc(body.timeRemind).format('YYYY-MM-DD HH:mm:ss.SSS Z') : null,
                            TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                            Description: body.description,
                        }).then(data => {
                            if (body.listAttendID) {
                                let list = JSON.parse(body.listAttendID);
                                list.forEach(itm => {
                                    mMeetAttend(db).create({ MeetID: data.dataValues.ID, UserID: itm });
                                });
                            }
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
                                description: data.dataValues.Description,
                                duration: data.dataValues.Duration,
                                activityType: Constant.ACTIVITY_TYPE.MEET,
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

    getListMeetAttend: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mMeetAttend(db).findAll({ where: { MeetID: body.meetID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    meetID: elm['MeetID'],
                                    userID: elm['UserID']
                                })
                            });

                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: array
                            }

                            res.json(result);
                        })
                    })
                })
            }
        })
    },

    updateMeetAttend: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.state == Constant.STATUS.SUCCESS) {
                            mMeetAttend(db).create({ MeetID: body.meetID, UserID: body.userID }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        } else {
                            mMeetAttend(db).destroy({ where: { MeetID: body.meetID, UserID: body.userID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                    })
                })
            }
        })
    },

    getAssociate: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mAssociate(db).findAll({ where: { ActivityID: body.meetID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    meetID: elm['ActivityID'],
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

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.state == Constant.STATUS.SUCCESS) {
                            mAssociate(db).create({ ActivityID: body.meetID, ContactID: body.contactID }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        } else {
                            mAssociate(db).destroy({ where: { ActivityID: body.meetID, ContactID: body.contactID } }).then(data => {
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

    getListMeet: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        var meet = mMeet(db);
                        meet.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
                        meet.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });
                        meet.belongsTo(mCompany(db), { foreignKey: 'CompanyID', sourceKey: 'CompanyID' });

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
                                if (body.timeType == 2) {
                                    whereAll = {
                                        TimeRemind: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                        [Op.and]: userFind
                                    };
                                } else {
                                    whereAll = {
                                        TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                        [Op.and]: userFind
                                    };
                                }
                            } else {
                                whereAll = {
                                    [Op.and]: userFind
                                };
                            }

                            meet.count({ where: whereAll }).then(all => {
                                meet.findAll({
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
                                                timeCreate: item.dataValues.TimeCreate,
                                                timeRemind: item.dataValues.TimeRemind,
                                                duration: item.dataValues.Duration,

                                                createID: item.User.dataValues ? item.User.dataValues.ID : -1,
                                                createName: item.User.dataValues ? item.User.dataValues.Name : "",

                                                contactID: item.dataValues.Contact ? item.dataValues.Contact.dataValues.ID : -1,
                                                contactName: item.dataValues.Contact ? item.dataValues.Contact.dataValues.Name : "",

                                                companyID: item.dataValues.Company ? item.dataValues.Company.dataValues.ID : -1,
                                                companyName: item.dataValues.Company ? item.dataValues.Company.dataValues.Name : "",

                                                type: item.dataValues.Company ? 1 : item.dataValues.Contact ? 2 : 0,
                                                activityType: Constant.ACTIVITY_TYPE.MEET
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

    deleteMeet: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
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
                                    rmAttend(db).destroy({ where: { MeetID: { [Op.in]: listActivityID } } }).then(() => {
                                        rmMeetContact(db).destroy({ where: { MeetID: { [Op.in]: listActivityID } } }).then(() => {
                                            mMeet(db).destroy({ where: { ID: { [Op.in]: listActivityID } } }).then(() => {
                                                res.json(Result.ACTION_SUCCESS);
                                            })
                                        })
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