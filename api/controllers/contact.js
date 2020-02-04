const Constant = require('../constants/constant');
const Op = require('sequelize').Op;

const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');

var mCompany = require('../tables/company');
var mContact = require('../tables/contact');
var mUser = require('../tables/user');


module.exports = {
    getListQuickContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mContact(db).findAll({
                            where: { UserID: body.userID, CompanyID: body.companyID },

                        }).then(data => {
                            let array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm.dataValues.ID,
                                    name: elm.dataValues.Name,
                                    jobTile: elm.dataValues.JobTile,
                                    email: elm.dataValues.Email,
                                })
                            })

                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: array
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

    getListContact: (req, res) => {//take this list for dropdown
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mContact(db).findAll({ where: { CompanyID: body.companyID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm['ID'],
                                    name: elm['Name'],
                                })
                            });
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: array
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

    getListContactFull: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        var contact = mContact(db);

                        contact.belongsTo(mCompany(db), { foreignKey: 'CompanyID', sourceKey: 'CompanyID' });
                        contact.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });

                        contact.findAll({
                            raw: true,
                            include: [{ model: mCompany(db) }, { model: mUser(db) }]
                        }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm['ID'],
                                    name: elm['Name'],
                                    email: elm['Email'],
                                    handPhone: elm['HandPhone'],
                                    timeCreate: elm['TimeCreate'],
                                    companyID: elm['Company.ID'],
                                    companyName: elm['Company.Name'],
                                    ownerID: elm['User.ID'],
                                    ownerName: elm['User.Name'],
                                })
                            });
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: array
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

    addContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mContact(db).create({
                            UserID: body.userID,
                            CompanyID: body.companyID,
                            Name: body.name,
                            Gender: body.gender,
                            JobTile: body.jobTile,
                            HandPhone: body.handPhone,
                            HomePhone: body.homePhone,
                            Email: body.email,
                            Address: body.address,
                            TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                        }).then(data => {
                            var obj = {
                                id: data.dataValues.ID,
                                name: data.dataValues.Name,
                                jobTile: data.dataValues.JobTile,
                                email: data.dataValues.Email,
                            };

                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: Constant.MESSAGE.ACTION_SUCCESS,
                                obj: obj
                            }

                            res.json(result);
                        })
                    })
                })
            } else {
                res.json()
            }
        })
    },

    addContactByID: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mContact(db).update(
                            { CompanyID: body.companyID },
                            { where: { ID: body.contactID } }
                        ).then(result => {
                            mContact(db).findOne({ where: { ID: body.contactID } }).then(data => {
                                var obj = {
                                    id: data.dataValues.ID,
                                    name: data.dataValues.Name,
                                    jobTile: data.dataValues.JobTile,
                                    email: data.dataValues.Email,
                                };

                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: Constant.MESSAGE.ACTION_SUCCESS,
                                    obj: obj
                                }

                                res.json(result);
                            })
                        })
                    })
                })
            } else {
                res.json()
            }
        })
    },

    searchContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mContact(db).findAll(
                            { where: { Name: { [Op.like]: "%" + body.searchKey } } }
                        ).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm['ID'],
                                    name: elm['Name'],
                                    handPhone: elm['HandPhone'],
                                })
                            });
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                array: array
                            }
                            res.json(result)
                        })
                    })
                })
            } else {
                res.json()
            }
        })
    },

    getDetailContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mContact(db).findOne({ where: { ID: body.contactID } }).then(data => {
                            var obj = {
                                id: data['ID'],
                                name: data['Name'],
                                address: data['Address'],
                                phone: data['HandPhone'],
                                email: data['Email'],
                                jobTile: data['JobTile'],
                            }
                            var result = {
                                status: Constant.STATUS.SUCCESS,
                                message: '',
                                obj: obj
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

    updateContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.contactName) {
                            mContact(db).update({ Name: body.contactName }, { where: { ID: body.contactID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.contactAddress) {
                            mContact(db).update({ Address: body.contactAddress }, { where: { ID: body.contactID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.contactPhone) {
                            mContact(db).update({ HandPhone: body.contactPhone }, { where: { ID: body.contactID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.contactEmail) {
                            mContact(db).update({ Email: body.contactEmail }, { where: { ID: body.contactID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.contactJobTile) {
                            mContact(db).update({ JobTile: body.contactJobTile }, { where: { ID: body.contactID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
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
}