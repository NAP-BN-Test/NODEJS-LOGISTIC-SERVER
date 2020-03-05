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

var mCallComment = require('../tables/call-comment');
var mEmailComment = require('../tables/email-comment');
var mMeetComment = require('../tables/meet-comment');
var mNoteComment = require('../tables/note-comment');

function getListCmt(listData) {
    var array = [];
    listData.forEach(elm => {
        array.push({
            id: elm['ID'],
            activityID: elm['ActivityID'],
            activityType: elm['activityType'],
            content: elm['Contents'],
            timeCreate: elm['TimeCreate'],
            userName: elm['UserName'],
        })
    })

    return array;
}

function getListActivityCall(db, body) {
    return new Promise((res) => {
        var call = mCall(db);
        call.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });
        call.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
        call.hasMany(mCallComment(db), { foreignKey: 'ActivityID' })

        call.findAll({
            where: { CompanyID: body.companyID },
            include: [
                { model: mContact(db) },
                { model: mCallComment(db) },
                { model: mUser(db), required: false }
            ]
        }).then(data => {
            var array = [];

            data.forEach(elm => {

                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeCreate,
                    timeRemind: elm.dataValues.TimeRemind,
                    timeStart: elm.dataValues.TimeStart,
                    contactID: elm.dataValues.Contact ? elm.dataValues.Contact.dataValues.ID : -1,
                    contactName: elm.dataValues.Contact ? elm.dataValues.Contact.dataValues.Name : "",
                    userID: elm.dataValues.User ? elm.dataValues.User.dataValues.ID : -1,
                    userName: elm.dataValues.User ? elm.dataValues.User.dataValues.Name : "",
                    state: elm.dataValues.State,
                    description: elm.dataValues.Description,
                    activityType: Constant.ACTIVITY_TYPE.CALL,
                    listComment: getListCmt(elm.CallComments)
                })
            });

            res(array);
        })
    })
}

function getListActivityEmail(db, body) {
    return new Promise((res) => {
        var email = mEmail(db);
        email.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });
        email.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
        email.hasMany(mEmailComment(db), { foreignKey: 'ActivityID' })

        email.findAll({
            where: { CompanyID: body.companyID },
            include: [
                { model: mContact(db) },
                { model: mEmailComment(db) },
                { model: mUser(db), required: false }]
        }).then(data => {
            var array = [];

            data.forEach(elm => {
                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeCreate,
                    timeStart: elm.dataValues.TimeStart,
                    timeRemind: elm.dataValues.TimeRemind,
                    contactID: elm.dataValues.Contact ? elm.dataValues.Contact.dataValues.ID : -1,
                    contactName: elm.dataValues.Contact ? elm.dataValues.Contact.dataValues.Name : "",
                    state: elm.dataValues.State,
                    description: elm.dataValues.Description,
                    activityType: Constant.ACTIVITY_TYPE.EMAIL,
                    listComment: getListCmt(elm.EmailComments),
                    userID: elm.dataValues.User ? elm.dataValues.User.dataValues.ID : -1,
                    userName: elm.dataValues.User ? elm.dataValues.User.dataValues.Name : ""
                })
            });

            res(array);
        })
    })
}

function getListActivityMeet(db, body) {
    return new Promise((res) => {
        var meet = mMeet(db);
        meet.belongsTo(mUser(db), { foreignKey: ['UserID'], sourceKey: ['UserID'] });
        meet.hasMany(mMeetComment(db), { foreignKey: 'ActivityID' })

        meet.findAll({
            where: Sequelize.or({ CompanyID: body.companyID }),
            include: [{ model: mUser(db) }, { model: mMeetComment(db) }]
        }).then(data => {
            var array = [];

            data.forEach(elm => {
                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeCreate,
                    timeStart: elm.dataValues.TimeStart,
                    timeRemind: elm.dataValues.TimeRemind,
                    description: elm.dataValues.Description,
                    duration: elm.dataValues.Duration,
                    activityType: Constant.ACTIVITY_TYPE.MEET,
                    listComment: getListCmt(elm.MeetComments),
                    userID: elm.dataValues.User ? elm.dataValues.User.dataValues.ID : -1,
                    userName: elm.dataValues.User ? elm.dataValues.User.dataValues.Name : ""
                })
            });

            res(array);
        })
    })
}

function getListActivityNote(db, body) {
    return new Promise((res) => {
        var note = mNote(db);
        note.hasMany(mNoteComment(db), { foreignKey: 'ActivityID' });
        note.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });

        note.findAll({
            where: { CompanyID: body.companyID },
            include: [{ model: mNoteComment(db) }]
        }).then(data => {
            var array = [];

            data.forEach(elm => {
                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeCreate,
                    timeRemind: elm.dataValues.TimeRemind,
                    description: elm.dataValues.Description,
                    activityType: Constant.ACTIVITY_TYPE.NOTE,
                    listComment: getListCmt(elm.NoteComments),
                    userID: elm.dataValues.User ? elm.dataValues.User.dataValues.ID : -1,
                    userName: elm.dataValues.User ? elm.dataValues.User.dataValues.Name : ""
                })
            });

            res(array);
        })
    })
}

function getListActivityTask(db, body) {
    return new Promise((res) => {

        var task = mTask(db);
        task.belongsTo(mUser(db), { foreignKey: 'AssignID', sourceKey: 'AssignID', as: 'AssignUser' });
        task.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID', as: 'CreateUser' });

        task.findAll({
            where: { CompanyID: body.companyID },
            include: [{ model: mUser(db), required: false, as: 'CreateUser' }]
        }).then(data => {
            var array = [];

            data.forEach(elm => {
                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeCreate,
                    timeRemind: elm.dataValues.TimeRemind,
                    timeAssign: elm.dataValues.TimeAssign,
                    timeStart: elm.dataValues.TimeStart,
                    description: elm.dataValues.Description,
                    taskType: elm.dataValues.Type,
                    taskName: elm.dataValues.Name,
                    assignID: elm.dataValues.AssignID,
                    activityType: Constant.ACTIVITY_TYPE.TASK,
                    status: elm.dataValues.Status ? elm.dataValues.Status : false,
                    listComment: [],

                    userID: elm.dataValues.CreateUser ? elm.dataValues.CreateUser.dataValues.ID : -1,
                    userName: elm.dataValues.CreateUser ? elm.dataValues.CreateUser.dataValues.Name : ""
                })
            });

            res(array);
        })
    })
}


module.exports = {

    getListActivity: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {
                    db.authenticate().then(() => {
                        if (body.activityType == Constant.ACTIVITY_TYPE.ALL) {
                            getListActivityCall(db, body).then(dataCall => {
                                var array = dataCall;
                                getListActivityEmail(db, body).then(dataEmail => {
                                    array = array.concat(dataEmail);
                                    getListActivityMeet(db, body).then(dataMeet => {
                                        array = array.concat(dataMeet);
                                        getListActivityNote(db, body).then(dataNote => {
                                            array = array.concat(dataNote);
                                            getListActivityTask(db, body).then(dataTask => {
                                                array = array.concat(dataTask);

                                                array = array.sort((a, b) => {
                                                    return b.timeCreate - a.timeCreate
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
                                })
                            })
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.CALL) { // type is call
                            getListActivityCall(db, body).then(data => {
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: data
                                }

                                res.json(result);
                            })
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.EMAIL) {
                            getListActivityEmail(db, body).then(data => {
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: data
                                }

                                res.json(result);
                            })
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.MEET) {
                            getListActivityMeet(db, body).then(data => {
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: data
                                }

                                res.json(result);
                            })
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.NOTE) {
                            getListActivityNote(db, body).then(data => {
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: data
                                }

                                res.json(result);
                            })
                        } else if (body.activityType == Constant.ACTIVITY_TYPE.TASK) {
                            getListActivityTask(db, body).then(data => {
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: data
                                }

                                res.json(result);
                            })
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

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.activityType == Constant.ACTIVITY_TYPE.CALL) {

                            if (body.contactID) {
                                mCall(db).update({ ContactID: body.contactID }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.activityState) {
                                mCall(db).update({ State: body.activityState }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.description) {
                                mCall(db).update({ Description: body.description }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z');
                                mCall(db).update({ TimeStart: date }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.EMAIL) {
                            if (body.contactID) {
                                mEmail(db).update({ ContactID: body.contactID }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.description) {
                                mEmail(db).update({ Description: body.description }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.activityState) {
                                mEmail(db).update({ State: body.activityState }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z');

                                mEmail(db).update({ TimeCreate: date }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.MEET) {
                            if (body.listAttendID) {

                                mMeetAttend(db).destroy({ where: { MeetID: body.activityID } }).then(() => {
                                    let listID = JSON.parse(body.listAttendID);

                                    listID.forEach(itm => {
                                        mMeetAttend(db).create({ MeetID: body.activityID, UserID: itm })
                                    });
                                    res.json(Result.ACTION_SUCCESS);
                                })
                            }
                            else if (body.duration) {
                                mMeet(db).update({ Duration: body.duration }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z');
                                mMeet(db).update({ TimeStart: date }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.description) {
                                mMeet(db).update({ Description: body.description }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.NOTE) {
                            if (body.description) {
                                mNote(db).update({ Description: body.description }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.TASK) {
                            if (body.assignID) {
                                mTask(db).update({ AssignID: body.assignID }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.taskName != null) {
                                mTask(db).update({ Name: body.taskName }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z');
                                mTask(db).update({ TimeStart: date }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeAssign != null) {
                                let date = moment.utc(body.timeAssign).format('YYYY-MM-DD HH:mm:ss.SSS Z');
                                mTask(db).update({ TimeAssign: date }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.taskType) {
                                mTask(db).update({ Type: body.taskType }, { where: { ID: body.activityID } }).then(() => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.description) {
                                mTask(db).update({ Description: body.description }, { where: { ID: body.activityID } }).then(() => {
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


}