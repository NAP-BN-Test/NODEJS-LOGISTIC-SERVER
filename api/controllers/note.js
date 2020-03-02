const Op = require('sequelize').Op;

const Constant = require('../constants/constant');
const Result = require('../constants/result');

var moment = require('moment');

var user = require('../controllers/user');
var database = require('../db');

var mNote = require('../tables/note');
var mAssociate = require('../tables/note-associate');

var rmAssociate = require('../tables/note-associate');
var rmComment = require('../tables/note-comment');

var mUser = require('../tables/user');
var mContact = require('../tables/contact');
var mCompany = require('../tables/company');


module.exports = {

    createNote: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        console.log(body);
                        mNote(db).create({
                            UserID: body.userID,
                            CompanyID: body.companyID,
                            ContactID: body.contactID,
                            Description: body.description,
                            TimeRemind: body.timeRemind ? body.timeRemind : null,
                            TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z')
                        }).then(data => {
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
                                description: data.dataValues.Description,
                                activityType: Constant.ACTIVITY_TYPE.NOTE,
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

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mAssociate(db).findAll({ where: { ActivityID: body.noteID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    noteID: elm['ActivityID'],
                                    contactID: elm['ContactID']
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
                            mAssociate(db).create({ ActivityID: body.noteID, ContactID: body.contactID }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        } else {
                            mAssociate(db).destroy({ where: { ActivityID: body.noteID, ContactID: body.contactID } }).then(data => {
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

    getListNote: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        var note = mNote(db);
                        note.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
                        note.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });
                        note.belongsTo(mCompany(db), { foreignKey: 'CompanyID', sourceKey: 'CompanyID' });

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

                            note.count({ where: whereAll }).then(all => {
                                note.findAll({
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

                                                createID: item.User.dataValues ? item.User.dataValues.ID : -1,
                                                createName: item.User.dataValues ? item.User.dataValues.Name : "",

                                                contactID: item.dataValues.Contact ? item.dataValues.Contact.dataValues.ID : -1,
                                                contactName: item.dataValues.Contact ? item.dataValues.Contact.dataValues.Name : "",

                                                companyID: item.dataValues.Company ? item.dataValues.Company.dataValues.ID : -1,
                                                companyName: item.dataValues.Company ? item.dataValues.Company.dataValues.Name : "",

                                                type: item.dataValues.Company ? 1 : item.dataValues.Contact ? 2 : 0,
                                                activityType: Constant.ACTIVITY_TYPE.NOTE
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

    deleteNote: (req, res) => {
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
                                    mNote(db).destroy({ where: { ID: { [Op.in]: listActivityID } } }).then(() => {
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