const Sequelize = require('sequelize');
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var fcm = require('../tables/fcm');
var mUser = require('../tables/user');
var mCompany = require('../tables/company');
var mCompanyChild = require('../tables/company-child');
var mDeal = require('../tables/deal');
var mContact = require('../tables/contact');

var mEmail = require('../tables/email');
var mCall = require('../tables/call');
var mMeet = require('../tables/meet');
var mNote = require('../tables/note');
var mTask = require('../tables/task');


module.exports = {
    fcm: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        fcm(db).belongsTo(user(db), { foreignKey: 'UserID' });

                        user(db).findOne({ where: { ID: body.userID } }).then(userItem => {
                            fcm(db).findAll({ where: { UserID: Number(userItem.ID) } }).then(fcmItem => {
                                res.json(fcmItem)
                            })
                        })

                    }).catch(err => res.json(err))
                })
            } else {
                res.json()
            }

        })

    },

    getListCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mCompany(db).findAll({ where: { UserID: body.userID } }).then(data => {
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: data
                            }
                            res.json(result)
                        })

                    }).catch(err => res.json(err))
                })
            } else {
                res.json()
            }
        })
    },

    getDetailCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mCompany(db).findOne({ where: { ID: body.companyID } }).then(data => {

                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: data
                            }
                            res.json(result)
                        })

                    }).catch(err => res.json(err))
                })
            } else {
                res.json()
            }
        })
    },

    getListQuickContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mContact(db).findAll({
                            where: { UserID: body.userID, CompanyID: body.companyID },
                            attributes: ['ID', 'NameVI', 'Email', 'JobTile']
                        }).then(data => {
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: data
                            }
                            res.json(result)
                        }).catch(() => {
                            res.json(Result.SYS_ERROR_RESULT);
                        })
                    }).catch(() => {
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            } else {
                res.json(Result.SYS_ERROR_RESULT);
            }
        })
    },

    getListQuickCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        var companyChild = mCompanyChild(db);
                        var company = mCompany(db);

                        companyChild.belongsTo(mCompany(db), { foreignKey: 'ChildID', sourceKey: 'ChildID' });

                        var array = [];

                        company.findOne({ where: { ID: body.parentID } }).then(data => {
                            array.push({
                                name: data.NameVI,
                                address: data.Address,
                                email: data.Email,
                                role: 1
                            });

                            companyChild.findAll({ raw: true, include: [{ model: mCompany(db) }] }).then(data => {

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['Company.ID'],
                                        name: elm['Company.NameVI'],
                                        address: elm['Company.Address'],
                                        email: elm['Company.Email'],
                                        role: 2
                                    })
                                });

                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: array
                                }

                                res.json(result);
                            }).catch(() => {
                                res.json(Result.SYS_ERROR_RESULT);
                            })
                        }).catch(() => {
                            res.json(Result.SYS_ERROR_RESULT);
                        })
                    }).catch(() => {
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            } else {
                res.json()
            }
        })
    },

    getListQuickDeal: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mDeal(db).findAll({ where: { CompanyID: body.companyID }, attributes: ['ID', 'TimeCreate', 'Amount', 'State', 'TimeClose'] }).then(data => {
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: data
                            }
                            res.json(result)
                        }).catch(() => {
                            res.json(Result.SYS_ERROR_RESULT);
                        })
                    }).catch(() => {
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            } else {
                res.json(Result.SYS_ERROR_RESULT);
            }
        })
    },

    getListActivity: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        var call = mCall(db);
                        call.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });

                        var email = mEmail(db);
                        email.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });

                        var meet = mMeet(db);
                        meet.belongsTo(mUser(db), { foreignKey: ['UserID', 'AttendID'], sourceKey: ['UserID', 'AttendID'] });

                        var task = mTask(db);
                        task.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });

                        if (body.activityType == Constant.ACTIVITY_TYPE.ALL) {
                            var array = [];

                            call.findAll({ where: { UserID: body.userID }, raw: true, include: [{ model: mContact(db) }] }).then(dataCall => {
                                var array = [];

                                dataCall.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        contactName: elm['Contact.NameVI'],
                                        state: elm['State'],
                                        description: elm['Description'],
                                        activityType: Constant.ACTIVITY_TYPE.CALL
                                    })
                                });

                                email.findAll({ where: { UserID: body.userID }, raw: true, include: [{ model: mContact(db) }] }).then(dataEmail => {
                                    dataEmail.forEach(elm => {
                                        array.push({
                                            id: elm['ID'],
                                            timeCreate: elm['TimeCreate'],
                                            timeRemind: elm['TimeRemind'],
                                            contactName: elm['Contact.NameVI'],
                                            state: elm['State'],
                                            description: elm['Description'],
                                            activityType: Constant.ACTIVITY_TYPE.EMAIL
                                        })
                                    });

                                    meet.findAll({
                                        where: Sequelize.or({ UserID: body.userID }, { AttendID: body.attendID }),
                                        raw: true,
                                        include: [{ model: mUser(db) }]
                                    }).then(data => {
                                        data.forEach(elm => {
                                            array.push({
                                                id: elm['ID'],
                                                timeCreate: elm['TimeStart'],
                                                timeRemind: elm['TimeRemind'],
                                                description: elm['Description'],
                                                duration: elm['Duration'],
                                                activityType: Constant.ACTIVITY_TYPE.MEET
                                            })
                                        });

                                        mNote(db).findAll({ where: { UserID: body.userID } }).then(data => {
                                            data.forEach(elm => {
                                                array.push({
                                                    id: elm['ID'],
                                                    timeCreate: elm['TimeCreate'],
                                                    timeRemind: elm['TimeRemind'],
                                                    description: elm['Description'],
                                                    activityType: Constant.ACTIVITY_TYPE.NOTE
                                                })
                                            });

                                            task.findAll({ where: { UserID: body.userID }, raw: true, include: [{ model: mContact(db) }] }).then(data => {
                                                data.forEach(elm => {
                                                    array.push({
                                                        id: elm['ID'],
                                                        timeCreate: elm['TimeCreate'],
                                                        timeRemind: elm['TimeRemind'],
                                                        description: elm['Description'],
                                                        contactName: elm['Contact.NameVI'],
                                                        activityType: Constant.ACTIVITY_TYPE.NOTE
                                                    })
                                                });

                                                array = array.sort((a, b) => {
                                                    return b.timeCreate - a.timeCreate
                                                });

                                                var result = {
                                                    status: Constant.STATUS.SUCCESS,
                                                    message: '',
                                                    array: array
                                                }

                                                res.json(result);
                                            });
                                        });
                                    });
                                });
                            });
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.CALL) { // type is call
                            call.findAll({ where: { UserID: body.userID }, raw: true, include: [{ model: mContact(db) }] }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        contactName: elm['Contact.NameVI'],
                                        state: elm['State'],
                                        description: elm['Description'],
                                        activityType: Constant.ACTIVITY_TYPE.CALL
                                    })
                                });

                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: array
                                }

                                res.json(result);
                            });
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.EMAIL) {
                            email.findAll({ where: { UserID: body.userID }, raw: true, include: [{ model: mContact(db) }] }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        contactName: elm['Contact.NameVI'],
                                        state: elm['State'],
                                        description: elm['Description'],
                                        activityType: Constant.ACTIVITY_TYPE.EMAIL
                                    })
                                });

                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: array
                                }

                                res.json(result);
                            });
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.MEET) {
                            meet.findAll({
                                where: Sequelize.or({ UserID: body.userID }, { AttendID: body.attendID }),
                                raw: true,
                                include: [{ model: mUser(db) }]
                            }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeStart'],
                                        timeRemind: elm['TimeRemind'],
                                        description: elm['Description'],
                                        duration: elm['Duration'],
                                        activityType: Constant.ACTIVITY_TYPE.MEET
                                    })
                                });

                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: array
                                }

                                res.json(result);
                            });
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.NOTE) {
                            mNote(db).findAll({ where: { UserID: body.userID } }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        description: elm['Description'],
                                        activityType: Constant.ACTIVITY_TYPE.NOTE
                                    })
                                });

                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: data
                                }

                                res.json(result);
                            });
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.TASK) {
                            task.findAll({ where: { UserID: body.userID }, raw: true, include: [{ model: mContact(db) }] }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        description: elm['Description'],
                                        contactName: elm['Contact.NameVI'],
                                        activityType: Constant.ACTIVITY_TYPE.NOTE
                                    })
                                });

                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: array
                                }

                                res.json(result);
                            });
                        }


                    }).catch(() => {
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            } else {
                res.json(Result.SYS_ERROR_RESULT);
            }
        })
    },

    getListContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mContact(db).findAll({ where: { CompanyID: body.companyID } }).then(data => {
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: data
                            }
                            res.json(result)
                        })

                    }).catch(err => res.json(err))
                })
            } else {
                res.json()
            }
        })
    },

}