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

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {
                    
                    db.authenticate().then(() => {

                        mCompany(db).findAll({ where: { UserID: body.userID } }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm['ID'],
                                    name: elm['NameVI'],
                                    email: elm['Email'],
                                    address: elm['Address'],
                                    phone: elm['Phone'],
                                    country: elm['Country'],
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

    getDetailCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mCompany(db).findOne({ where: { ID: body.companyID } }).then(data => {
                            var obj = {
                                id: data['ID'],
                                name: data['NameVI'],
                                shortName: data['ShortName'],
                                address: data['Address'],
                                phone: data['Phone'],
                                email: data['Email'],
                                country: data['Country'],
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

    getListQuickContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
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

                            companyChild.findAll({
                                where: { ParentID: body.companyID },
                                raw: true,
                                include: [{ model: mCompany(db) }]
                            }).then(data => {

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

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
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
                                    name: elm['NameVI'],
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

                        contact.findAll({
                            where: { CompanyID: body.companyID },
                            raw: true,
                            include: [{ model: mCompany(db) }]
                        }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm['ID'],
                                    name: elm['NameVI'],
                                    email: elm['Email'],
                                    handPhone: elm['HandPhone'],
                                    owner: elm['Owner'],
                                    timeCreate: elm['TimeCreate'],
                                    companyID: elm['Company.ID'],
                                    companyName: elm['Company.NameVI'],
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

}