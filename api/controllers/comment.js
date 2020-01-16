const Constant = require('../constants/constant');
const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');

var mCallComment = require('../tables/call-comment');
var mEmailComment = require('../tables/email-comment');
var mMeetComment = require('../tables/meet-comment');
var mNoteComment = require('../tables/note-comment');


module.exports = {
    addComment: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.activityType == Constant.ACTIVITY_TYPE.CALL) {
                            mCallComment(db).create({
                                ActivityID: body.activityID,
                                Contents: body.content,
                                TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                                UserID: body.userID,
                                UserName: body.userName
                            }).then(data => {
                                var obj = {
                                    id: data.dataValues.ID,
                                    timeCreate: data.dataValues.TimeCreate,
                                    userID: data.dataValues.UserID,
                                    userName: data.dataValues.UserName,
                                    content: data.dataValues.Contents,
                                }
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: Constant.MESSAGE.ACTION_SUCCESS,
                                    obj: obj
                                }

                                res.json(result);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.NOTE) {
                            mNoteComment(db).create({
                                ActivityID: body.activityID,
                                Contents: body.content,
                                TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                                UserID: body.userID,
                                UserName: body.userName
                            }).then(data => {
                                var obj = {
                                    id: data.dataValues.ID,
                                    timeCreate: data.dataValues.TimeCreate,
                                    userID: data.dataValues.UserID,
                                    userName: data.dataValues.UserName,
                                    content: data.dataValues.Contents,
                                }
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: Constant.MESSAGE.ACTION_SUCCESS,
                                    obj: obj
                                }

                                res.json(result);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.EMAIL) {
                            mEmailComment(db).create({
                                ActivityID: body.activityID,
                                Contents: body.content,
                                TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                                UserID: body.userID,
                                UserName: body.userName
                            }).then(data => {
                                var obj = {
                                    id: data.dataValues.ID,
                                    timeCreate: data.dataValues.TimeCreate,
                                    userID: data.dataValues.UserID,
                                    userName: data.dataValues.UserName,
                                    content: data.dataValues.Contents,
                                }
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: Constant.MESSAGE.ACTION_SUCCESS,
                                    obj: obj
                                }

                                res.json(result);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.MEET) {
                            mMeetComment(db).create({
                                ActivityID: body.activityID,
                                Contents: body.content,
                                TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                                UserID: body.userID,
                                UserName: body.userName
                            }).then(data => {
                                var obj = {
                                    id: data.dataValues.ID,
                                    timeCreate: data.dataValues.TimeCreate,
                                    userID: data.dataValues.UserID,
                                    userName: data.dataValues.UserName,
                                    content: data.dataValues.Contents,
                                }
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: Constant.MESSAGE.ACTION_SUCCESS,
                                    obj: obj
                                }

                                res.json(result);
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

    editComment: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.activityType == Constant.ACTIVITY_TYPE.CALL) {
                            mCallComment(db).update({
                                Contents: body.content,
                                TimeCreate: new Date().toISOString(),
                            }, { where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.NOTE) {
                            mNoteComment(db).update({
                                Contents: body.content,
                                TimeCreate: new Date().toISOString(),
                            }, { where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.EMAIL) {
                            mEmailComment(db).update({
                                Contents: body.content,
                                TimeCreate: new Date().toISOString(),
                            }, { where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.MEET) {
                            mMeetComment(db).update({
                                Contents: body.content,
                                TimeCreate: new Date().toISOString(),
                            }, { where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
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

    deleteComment: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.activityType == Constant.ACTIVITY_TYPE.CALL) {
                            mCallComment(db).destroy({ where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.NOTE) {
                            mNoteComment(db).destroy({ where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.EMAIL) {
                            mEmailComment(db).destroy({ where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
                            })
                        }
                        else if (body.activityType == Constant.ACTIVITY_TYPE.MEET) {
                            mMeetComment(db).destroy({ where: { ID: body.cmtID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS);
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