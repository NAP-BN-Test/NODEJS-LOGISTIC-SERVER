const Sequelize = require('sequelize');
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');

var mUser = require('../tables/user');
var mContact = require('../tables/contact');

var mEmail = require('../tables/email');
var mCall = require('../tables/call');
var mMeet = require('../tables/meet');
var mNote = require('../tables/note');
var mTask = require('../tables/task');

var mMeetAttend = require('../tables/meet-attend');


module.exports = {

    getListActivity: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
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
                            call.findAll({ where: { CompanyID: body.companyID }, raw: true, include: [{ model: mContact(db) }] }).then(dataCall => {
                                var array = [];

                                dataCall.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        contactID: elm['Contact.ID'],
                                        contactName: elm['Contact.NameVI'],
                                        state: elm['State'],
                                        description: elm['Description'],
                                        activityType: Constant.ACTIVITY_TYPE.CALL
                                    })
                                });

                                email.findAll({ where: { CompanyID: body.companyID }, raw: true, include: [{ model: mContact(db) }] }).then(dataEmail => {
                                    dataEmail.forEach(elm => {
                                        array.push({
                                            id: elm['ID'],
                                            timeCreate: elm['TimeCreate'],
                                            timeRemind: elm['TimeRemind'],
                                            contactID: elm['Contact.ID'],
                                            contactName: elm['Contact.NameVI'],
                                            state: elm['State'],
                                            description: elm['Description'],
                                            activityType: Constant.ACTIVITY_TYPE.EMAIL
                                        })
                                    });

                                    meet.findAll({
                                        where: Sequelize.or({ CompanyID: body.companyID }, { AttendID: body.attendID }),
                                        raw: true,
                                        include: [{ model: mUser(db) }]
                                    }).then(dataMeet => {
                                        dataMeet.forEach(elm => {
                                            array.push({
                                                id: elm['ID'],
                                                timeCreate: elm['TimeStart'],
                                                timeRemind: elm['TimeRemind'],
                                                description: elm['Description'],
                                                duration: elm['Duration'],
                                                activityType: Constant.ACTIVITY_TYPE.MEET
                                            })
                                        });

                                        mNote(db).findAll({ where: { CompanyID: body.companyID } }).then(dataNote => {
                                            dataNote.forEach(elm => {
                                                array.push({
                                                    id: elm['ID'],
                                                    timeCreate: elm['TimeCreate'],
                                                    timeRemind: elm['TimeRemind'],
                                                    description: elm['Description'],
                                                    activityType: Constant.ACTIVITY_TYPE.NOTE
                                                })
                                            });

                                            task.findAll({ where: { CompanyID: body.companyID }, raw: true, include: [{ model: mContact(db) }] }).then(dataTask => {
                                                dataTask.forEach(elm => {
                                                    array.push({
                                                        id: elm['ID'],
                                                        timeCreate: elm['TimeCreate'],
                                                        timeRemind: elm['TimeRemind'],
                                                        description: elm['Description'],
                                                        contactID: elm['Contact.ID'],
                                                        contactName: elm['Contact.NameVI'],
                                                        activityType: Constant.ACTIVITY_TYPE.TASK
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
                            call.findAll({ where: { CompanyID: body.companyID }, raw: true, include: [{ model: mContact(db) }] }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        contactName: elm['Contact.NameVI'],
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
                            email.findAll({ where: { CompanyID: body.companyID }, raw: true, include: [{ model: mContact(db) }] }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        contactID: elm['Contact.ID'],
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
                                where: Sequelize.or({ CompanyID: body.companyID }, { AttendID: body.attendID }),
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
                            mNote(db).findAll({ where: { CompanyID: body.companyID } }).then(data => {
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
                            task.findAll({ where: { CompanyID: body.companyID }, raw: true, include: [{ model: mContact(db) }] }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['ID'],
                                        timeCreate: elm['TimeCreate'],
                                        timeRemind: elm['TimeRemind'],
                                        description: elm['Description'],
                                        contactID: elm['Contact.ID'],
                                        contactName: elm['Contact.NameVI'],
                                        activityType: Constant.ACTIVITY_TYPE.TASK
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

    updateActivity: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.activityType == Constant.ACTIVITY_TYPE.CALL) {

                            if (body.contactID) {
                                mCall(db).update({ ContactID: body.contactID }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.activityState) {
                                mCall(db).update({ State: body.activityState }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = new Date(body.timeStart).toISOString();
                                mCall(db).update({ TimeCreate: date }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.EMAIL) {
                            if (body.contactID) {
                                mEmail(db).update({ ContactID: body.contactID }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.activityState) {
                                mEmail(db).update({ State: body.activityState }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z');

                                mEmail(db).update({ TimeCreate: date }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.MEET) {
                            if (body.listAttendID) {

                                mMeetAttend(db).destroy({ where: { MeetID: body.activityID } }).then(data => {
                                    let listID = JSON.parse(body.listAttendID);

                                    listID.forEach(itm => {
                                        mMeetAttend(db).create({ MeetID: body.activityID, UserID: itm })
                                    });
                                    res.json(Result.ACTION_SUCCESS);
                                })
                            }
                            else if (body.duration) {
                                mMeet(db).update({ Duration: body.duration }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = new Date(body.timeStart).toISOString();
                                console.log(date, body.activityID);

                                mMeet(db).update({ TimeStart: date }, { where: { ID: body.activityID } }).then(data => {
                                    console.log(data);

                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.NOTE) {
                            if (body.description) {
                                mNote(db).update({ Description: body.description }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            } else {
                res.json(Result.SYS_ERROR_RESULT);
            }
        })
    },

    getListMeetAttend: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mMeetAttend(db).findAll({ where: { MeetID: body.meetID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    meetID: elm['MeetID'],
                                    userID: elm['UserID'],
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
    }

}