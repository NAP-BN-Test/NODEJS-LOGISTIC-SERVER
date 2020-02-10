const Constant = require('../constants/constant');
const Op = require('sequelize').Op;

const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');

var mCompany = require('../tables/company');
var mContact = require('../tables/contact');
var mUser = require('../tables/user');
var mUserFollow = require('../tables/user-follow');

var rmTaskAssciate = require('../tables/task-associate');
var rmEmailAssciate = require('../tables/email-associate');
var rmCallAssciate = require('../tables/call-associate');
var rmNoteAssciate = require('../tables/note-associate');
var rmMeetAssciate = require('../tables/meet-associate');
var rmUserFollow = require('../tables/user-follow');
var rmMeetContact = require('../tables/meet-contact');
var rmDeal = require('../tables/deal');



module.exports = {
    getListQuickContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mContact(db).findAll({
                            where: { CompanyID: body.companyID },

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

                        mUser(db).findOne({ where: { ID: body.userID } }).then(user => {
                            var contact = mContact(db);

                            contact.belongsTo(mCompany(db), { foreignKey: 'CompanyID', sourceKey: 'CompanyID' });
                            contact.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
                            contact.hasMany(mUserFollow(db), { foreignKey: 'ContactID' })

                            contact.findAll({
                                include: [
                                    { model: mCompany(db), required: false },
                                    { model: mUser(db), required: false },
                                    {
                                        model: mUserFollow(db),
                                        required: false,
                                        where: { UserID: body.userID, Type: 2 }
                                    }
                                ],
                                // where: user.dataValues.Roles == Constant.USER_ROLE.MANAGER ? null : { UserID: body.userID }
                            }).then(data => {
                                var array = [];

                                data.forEach(elm => {
                                    array.push({
                                        id: elm.dataValues.ID,
                                        name: elm.dataValues.Name,
                                        email: elm.dataValues.Email,
                                        phone: elm.dataValues.Phone,
                                        timeCreate: elm.dataValues.TimeCreate,
                                        companyID: elm.dataValues.Company ? elm.dataValues.Company.dataValues.ID : null,
                                        companyName: elm.dataValues.Company ? elm.dataValues.Company.dataValues.Name : "",
                                        ownerID: elm.dataValues.User ? elm.dataValues.User.dataValues.ID : null,
                                        ownerName: elm.dataValues.User ? elm.dataValues.User.dataValues.Name : "",
                                        follow: elm.dataValues.UserFollows[0] ? elm.dataValues.UserFollows[0]['Follow'] : false
                                    })
                                });
                                var result = {
                                    status: Constant.STATUS.SUCCESS,
                                    message: '',
                                    array: array
                                }
                                res.json(result)
                            })
                        });

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
                            CompanyID: body.addOut ? null : body.companyID,
                            Name: body.name,
                            Gender: body.gender,
                            JobTile: body.jobTile,
                            Phone: body.phone,
                            Email: body.email,
                            Address: body.address,
                            Zalo: body.zalo,
                            Facebook: body.facebook,
                            Skype: body.skype,
                            TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                        }).then(data => {
                            var obj = {
                                id: data.dataValues.ID,
                                name: data.dataValues.Name,
                                jobTile: data.dataValues.JobTile,
                                email: data.dataValues.Email,
                                handPhone: data.dataValues.Phone,
                                timeCreate: data.dataValues.TimeCreate,
                                companyID: "",
                                companyName: "",
                                ownerID: "",
                                ownerName: "",
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
                        ).then(() => {
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
                                    phone: elm['Phone'],
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
                        let contact = mContact(db);
                        contact.hasMany(mUserFollow(db), { foreignKey: 'ContactID' })

                        contact.findOne({
                            where: { ID: body.contactID },
                            include: {
                                model: mUserFollow(db),
                                required: false,
                                where: { UserID: body.userID, Type: 2 }
                            }
                        }).then(data => {
                            var obj = {
                                id: data['ID'],
                                name: data['Name'],
                                address: data['Address'],
                                phone: data['Phone'],
                                email: data['Email'],
                                jobTile: data['JobTile'],
                                follow: data.dataValues.UserFollows[0] ? data.dataValues.UserFollows[0]['Follow'] : false
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
                            mContact(db).update({ Phone: body.contactPhone }, { where: { ID: body.contactID } }).then(data => {
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

    assignContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.contactIDs) {
                            let listContact = JSON.parse(body.contactIDs);
                            let listContactID = [];
                            listContact.forEach(item => {
                                listContactID.push(Number(item + ""));
                            })

                            mContact(db).update(
                                { UserID: body.assignID },
                                { where: { ID: { [Op.in]: listContactID } } }
                            ).then(data => {
                                if (data) {
                                    mUser(db).findOne({ where: { ID: body.assignID } }).then(user => {
                                        var obj = {
                                            id: user.dataValues.ID,
                                            name: user.dataValues.Name,
                                        };

                                        var result = {
                                            status: Constant.STATUS.SUCCESS,
                                            message: Constant.MESSAGE.ACTION_SUCCESS,
                                            obj: obj
                                        }

                                        res.json(result);
                                    });
                                }
                            })
                        }
                    })
                })
            } else {
                res.json()
            }
        })
    },

    deleteContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.contactIDs) {
                            let listContact = JSON.parse(body.contactIDs);
                            let listContactID = [];
                            listContact.forEach(item => {
                                listContactID.push(Number(item + ""));
                            });

                            mUser(db).findOne({ where: { ID: body.userID } }).then(user => {
                                if (user.dataValues.Roles == Constant.USER_ROLE.MANAGER) {
                                    rmCallAssciate(db).update(
                                        { ContactID: null },
                                        { where: { ContactID: { [Op.in]: listContactID } } }
                                    ).then(() => {
                                        rmEmailAssciate(db).update(
                                            { ContactID: null },
                                            { where: { ContactID: { [Op.in]: listContactID } } }
                                        ).then(() => {
                                            rmMeetAssciate(db).update(
                                                { ContactID: null },
                                                { where: { ContactID: { [Op.in]: listContactID } } }
                                            ).then(() => {
                                                rmNoteAssciate(db).update(
                                                    { ContactID: null },
                                                    { where: { ContactID: { [Op.in]: listContactID } } }
                                                ).then(() => {
                                                    rmTaskAssciate(db).update(
                                                        { ContactID: null },
                                                        { where: { ContactID: { [Op.in]: listContactID } } }
                                                    ).then(() => {
                                                        rmUserFollow(db).update(
                                                            { ContactID: null },
                                                            { where: { ContactID: { [Op.in]: listContactID } } }
                                                        ).then(() => {
                                                            rmDeal(db).update(
                                                                { ContactID: null },
                                                                { where: { ContactID: { [Op.in]: listContactID } } }
                                                            ).then(() => {
                                                                rmMeetContact(db).update(
                                                                    { ContactID: null },
                                                                    { where: { ContactID: { [Op.in]: listContactID } } }
                                                                ).then(() => {
                                                                    mContact(db).destroy({ where: { ID: { [Op.in]: listContactID } } }).then(() => {
                                                                        res.json(Result.ACTION_SUCCESS);
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }
                                else {
                                    mContact(db).update({ UserID: null }, { where: { ID: { [Op.in]: listContactID } } }).then(() => {
                                        res.json(Result.ACTION_SUCCESS);
                                    })
                                }
                            });
                        }
                    })
                })
            } else {
                res.json()
            }
        })
    },

    followContact: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mUserFollow(db).findOne({ where: { UserID: body.userID, ContactID: body.contactID, Type: 2 } }).then(data => {
                            if (data) {
                                mUserFollow(db).update(
                                    { Follow: Boolean(body.follow) },
                                    { where: { UserID: body.userID, ContactID: body.contactID, Type: 2 } }
                                ).then(() => {
                                    var result = {
                                        status: Constant.STATUS.SUCCESS,
                                        message: Constant.MESSAGE.ACTION_SUCCESS,
                                        follow: body.follow
                                    }
                                    res.json(result)
                                })
                            } else {
                                mUserFollow(db).create({
                                    UserID: body.userID,
                                    ContactID: body.contactID,
                                    Type: 2,
                                    Follow: true
                                }).then(() => {
                                    var result = {
                                        status: Constant.STATUS.SUCCESS,
                                        message: Constant.MESSAGE.ACTION_SUCCESS,
                                        follow: true
                                    }
                                    res.json(result)
                                })
                            }
                        })

                    })
                })
            } else {
                res.json()
            }
        })
    },
}