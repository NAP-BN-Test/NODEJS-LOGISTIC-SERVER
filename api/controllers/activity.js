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
var mNoteAssociate = require('../tables/note-associate');

var mCallComment = require('../tables/call-comment');
var mEmailComment = require('../tables/email-comment');
var mMeetComment = require('../tables/meet-comment');
var mNoteComment = require('../tables/note-comment');


function getListComment(db, activityID, activityType) {
    return new Promise((res) => {
        mActivityComment(db).findAll({ where: { ActivityID: activityID, ActivityType: activityType }, raw: true }).then(data => {
            var array = [];

            data.forEach(elm => {
                array.push({
                    id: elm['ID'],
                    activityID: elm['ActivityID'],
                    activityType: elm['activityType'],
                    content: elm['Contents'],
                    timeCreate: elm['TimeCreate'],
                    userName: elm['UserName'],
                })
            });

            res(array);
        })
    })
}

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
        call.hasMany(mCallComment(db), { foreignKey: 'ActivityID' })

        call.findAll({
            where: { CompanyID: body.companyID },
            include: [{ model: mContact(db) }, { model: mCallComment(db) }]
        }).then(data => {
            var array = [];

            data.forEach(elm => {

                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeCreate,
                    timeRemind: elm.dataValues.TimeRemind,
                    timeStart: elm.dataValues.TimeStart,
                    contactID: elm.dataValues.Contact.dataValues.ID,
                    contactName: elm.dataValues.Contact.dataValues.NameVI,
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
        email.hasMany(mEmailComment(db), { foreignKey: 'ActivityID' })

        email.findAll({
            where: { CompanyID: body.companyID },
            include: [{ model: mContact(db) }, { model: mEmailComment(db) }]
        }).then(data => {
            var array = [];

            data.forEach(elm => {
                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeCreate,
                    timeRemind: elm.dataValues.TimeRemind,
                    contactID: elm.dataValues.Contact.dataValues.ID,
                    contactName: elm.dataValues.Contact.dataValues.NameVI,
                    state: elm.dataValues.State,
                    description: elm.dataValues.Description,
                    activityType: Constant.ACTIVITY_TYPE.EMAIL,
                    listComment: getListCmt(elm.EmailComments)
                })
            });

            res(array);
        })
    })
}

function getListActivityMeet(db, body) {
    return new Promise((res) => {
        var meet = mMeet(db);
        meet.belongsTo(mUser(db), { foreignKey: ['UserID', 'AttendID'], sourceKey: ['UserID', 'AttendID'] });
        meet.hasMany(mMeetComment(db), { foreignKey: 'ActivityID' })

        meet.findAll({
            where: Sequelize.or({ CompanyID: body.companyID }, { AttendID: body.attendID }),
            include: [{ model: mUser(db) }, { model: mMeetComment(db) }]
        }).then(data => {
            var array = [];

            data.forEach(elm => {
                array.push({
                    id: elm.dataValues.ID,
                    timeCreate: elm.dataValues.TimeStart,
                    timeRemind: elm.dataValues.TimeRemind,
                    description: elm.dataValues.Description,
                    duration: elm.dataValues.Duration,
                    activityType: Constant.ACTIVITY_TYPE.MEET,
                    listComment: getListCmt(elm.MeetComments)
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
                    listComment: getListCmt(elm.NoteComments)
                })
            });

            res(array);
        })
    })
}

function getListActivityTask(db, body) {
    return new Promise((res) => {

        var task = mTask(db);
        task.belongsTo(mUser(db), { foreignKey: 'AssignID', sourceKey: 'AssignID' });

        task.findAll({ where: { CompanyID: body.companyID }, raw: true, include: [{ model: mUser(db) }] })
            .then(data => {
                var array = [];

                data.forEach(elm => {
                    array.push({
                        id: elm['ID'],
                        timeCreate: elm['TimeCreate'],
                        timeRemind: elm['TimeRemind'],
                        description: elm['Description'],
                        assignID: elm['User.ID'],
                        assignName: elm['User.Name'],
                        taskType: elm['Type'],
                        activityType: Constant.ACTIVITY_TYPE.TASK
                    })
                });

                res(array);
            })
    })
}


module.exports = {

    getListActivity: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
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
                            else if (body.description) {
                                mCall(db).update({ Description: body.description }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = moment.utc(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS Z');
                                mCall(db).update({ TimeStart: date }, { where: { ID: body.activityID } }).then(data => {
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
                                mMeet(db).update({ TimeStart: date }, { where: { ID: body.activityID } }).then(data => {
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
                        else if (body.activityType == Constant.ACTIVITY_TYPE.TASK) {
                            if (body.assignID) {
                                mTask(db).update({ AssignID: body.assignID }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.timeStart != null) {
                                let date = new Date(body.timeStart).toISOString();
                                mTask(db).update({ TimeCreate: date }, { where: { ID: body.activityID } }).then(data => {
                                    res.json(Result.ACTION_SUCCESS)
                                })
                            }
                            else if (body.taskType) {
                                mTask(db).update({ Type: body.taskType }, { where: { ID: body.activityID } }).then(data => {
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
    },

    createNote: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mNote(db).create({
                            UserID: body.userID,
                            CompanyID: body.companyID,
                            Description: body.description,
                            TimeRemind: body.timeRemind ? body.timeRemind : null,
                            TimeCreate: new Date().toISOString()
                        }).then(data => {
                            if (body.listAssociate) {
                                let list = JSON.parse(body.listAssociate);
                                list.forEach(itm => {
                                    mNoteAssociate(db).create({ NoteID: data.dataValues.ID, UserID: itm });
                                });
                            }
                            var obj = {
                                id: data.dataValues.ID,
                                timeCreate: data.dataValues.TimeCreate,
                                timeRemind: data.dataValues.TimeRemind,
                                description: data.dataValues.Description,
                                activityType: Constant.ACTIVITY_TYPE.NOTE,
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

    getNoteAssociate: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mNoteAssociate(db).findAll({ where: { NoteID: body.noteID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    noteID: elm['NoteID'],
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
                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            }
        })
    },

    updateNoteAssociate: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.state == Constant.STATUS.SUCCESS) {
                            mNoteAssociate(db).create({ NoteID: body.noteID, UserID: body.userID }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        } else {
                            mNoteAssociate(db).destroy({ where: { NoteID: body.noteID, UserID: body.userID } }).then(data => {
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

    deleteNote: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mNoteAssociate(db).destroy({ where: { NoteID: body.noteID } }).then(data => {
                            mNote(db).destroy({ where: { ID: body.noteID, UserID: body.userID } }).then(() => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        })
                    }).catch((err) => {
                        console.log(err);
                        res.json(Result.SYS_ERROR_RESULT);
                    })
                })
            }
        })
    },

    createCall: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        var call = mCall(db);
                        call.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });

                        call.create({
                            UserID: body.userID,
                            CompanyID: body.companyID,
                            ContactID: body.contactID,
                            CompanyID: body.companyID,
                            State: body.outcomeType,
                            TimeStart: body.timeStart,
                            TimeRemind: body.timeRemind ? body.timeRemind : null,
                            TimeCreate: new Date().toISOString(),
                            Description: body.description,
                        }, { raw: true, include: [{ model: mContact(db) }] }).then(data => {
                            var obj = {
                                id: data.dataValues.ID,
                                timeCreate: data.dataValues.TimeCreate,
                                timeRemind: data.dataValues.TimeRemind,
                                timeStart: data.dataValues.TimeStart,
                                contactID: data.dataValues.ContactID,
                                description: data.dataValues.Description,
                                state: data.dataValues.State,
                                activityType: Constant.ACTIVITY_TYPE.CALL,
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

}