const Op = require('sequelize').Op;

var moment = require('moment');

const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mCompany = require('../tables/company');
var mCompanyChild = require('../tables/company-child');
var mUser = require('../tables/user');
var mUserFollow = require('../tables/user-follow');

var rmCompanyChild = require('../tables/company-child');
var rmCall = require('../tables/call');
var rmEmail = require('../tables/email');
var rmMeet = require('../tables/meet');
var rmNote = require('../tables/note');
var rmContact = require('../tables/contact');
var rmDeal = require('../tables/deal');
var rmUserFlow = require('../tables/user-follow');



module.exports = {
    getListCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mUser(db).findOne({ where: { ID: body.userID } }).then(user => {
                            if (user) {
                                let company = mCompany(db);
                                company.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
                                company.hasMany(mUserFollow(db), { foreignKey: 'CompanyID' })

                                company.findAll({
                                    include: [
                                        { model: mUser(db), required: false },
                                        {
                                            model: mUserFollow(db),
                                            required: false,
                                            where: { UserID: body.userID, Type: 1 }
                                        }
                                    ],
                                    where: user.dataValues.Roles == Constant.USER_ROLE.MANAGER ? null : { UserID: body.userID }
                                }).then(data => {
                                    var array = [];

                                    data.forEach(elm => {
                                        array.push({
                                            id: elm.dataValues.ID,
                                            name: elm.dataValues.Name,
                                            ownerID: elm.dataValues.UserID,
                                            ownerName: elm.dataValues.User ? elm.dataValues.User.dataValues.Name : "",
                                            address: elm.dataValues.Address,
                                            phone: elm.dataValues.Phone,
                                            country: elm.dataValues.Country,
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
                            }

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

                        let company = mCompany(db);
                        company.hasMany(mUserFollow(db), { foreignKey: 'CompanyID' })

                        company.findOne({
                            where: { ID: body.companyID },
                            include: {
                                model: mUserFollow(db),
                                required: false,
                                where: { UserID: body.userID, Type: 1 }
                            }
                        }).then(data => {
                            var obj = {
                                id: data['ID'],
                                name: data['Name'],
                                shortName: data['ShortName'],
                                address: data['Address'],
                                phone: data['Phone'],
                                email: data['Email'],
                                country: data['Country'],
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

                        company.findOne({ where: { ID: body.companyID } }).then(data => {
                            company.findOne({ where: { ID: data.ParentID } }).then(data1 => {
                                if (data1) {
                                    array.push({
                                        id: data1.dataValues.ID,
                                        name: data1.dataValues.Name,
                                        address: data1.dataValues.Address,
                                        email: data1.dataValues.Email,
                                        role: 1
                                    });
                                }
                            })

                            companyChild.findAll({
                                where: { ParentID: body.companyID },
                                raw: true,
                                include: [{ model: mCompany(db) }]
                            }).then(data => {

                                data.forEach(elm => {
                                    array.push({
                                        id: elm['Company.ID'],
                                        name: elm['Company.Name'],
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

    updateCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.companyName) {
                            mCompany(db).update({ Name: body.companyName }, { where: { ID: body.companyID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.companyShortName) {
                            mCompany(db).update({ ShortName: body.companyShortName }, { where: { ID: body.companyID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.companyAddress) {
                            mCompany(db).update({ Address: body.companyAddress }, { where: { ID: body.companyID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.companyPhone) {
                            mCompany(db).update({ Phone: body.companyPhone }, { where: { ID: body.companyID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.companyEmail) {
                            mCompany(db).update({ Email: body.companyEmail }, { where: { ID: body.companyID } }).then(data => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                        else if (body.companyCountry) {
                            mCompany(db).update({ Country: body.companyCountry }, { where: { ID: body.companyID } }).then(data => {
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

    searchCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mCompany(db).findAll(
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

                            mCompanyChild(db).findAll({ raw: true, attributes: ['ChildID'], where: { ParentID: body.companyID } }).then(data1 => {
                                array = array.filter(item => {
                                    let index = data1.findIndex(it1 => {
                                        return it1.ChildID == item.id;
                                    });
                                    if (index > -1)
                                        return false;
                                    else
                                        return true;
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
                })
            } else {
                res.json()
            }
        })
    },

    addCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mCompany(db).create({
                            UserID: body.userID,
                            Name: body.name,
                            ShortName: body.shortName,
                            Phone: body.phone,
                            Email: body.email,
                            Address: body.address,
                            Country: body.country,
                            TimeCreate: moment.utc(moment().format('YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD HH:mm:ss.SSS Z'),
                        }).then(data => {
                            var obj;
                            if (body.role == Constant.COMPANY_ROLE.PARENT) {
                                mCompany(db).update(
                                    { ParentID: data.dataValues.ID },
                                    { where: { ID: body.companyID } });
                                obj = {
                                    id: data.dataValues.ID,
                                    name: data.dataValues.Name,
                                    address: data.dataValues.Address,
                                    email: data.dataValues.Email,
                                    role: Constant.COMPANY_ROLE.PARENT,
                                    phone: data.dataValues.Phone,
                                    country: data.dataValues.Country,
                                    ownerID: -1,
                                    ownerName: ""
                                }
                            }
                            else if (body.role == Constant.COMPANY_ROLE.CHILD) {
                                mCompanyChild(db).create({
                                    ParentID: body.companyID,
                                    ChildID: data.dataValues.ID
                                })
                                obj = {
                                    id: data.dataValues.ID,
                                    name: data.dataValues.Name,
                                    address: data.dataValues.Address,
                                    email: data.dataValues.Email,
                                    role: Constant.COMPANY_ROLE.CHILD,
                                    phone: data.dataValues.Phone,
                                    country: data.dataValues.Country,
                                    ownerID: -1,
                                    ownerName: ""
                                }
                            } else {
                                obj = {
                                    id: data.dataValues.ID,
                                    name: data.dataValues.Name,
                                    address: data.dataValues.Address,
                                    email: data.dataValues.Email,
                                    role: -1,
                                    phone: data.dataValues.Phone,
                                    country: data.dataValues.Country,
                                    ownerID: -1,
                                    ownerName: ""
                                }
                            }


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

    addParentCompanyByID: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mCompany(db).update(
                            { ParentID: body.companyAddID },
                            { where: { ID: body.companyID } }
                        ).then(result => {
                            mCompany(db).findOne({ where: { ID: body.companyAddID } }).then(data => {
                                var obj = {
                                    id: data.dataValues.ID,
                                    name: data.dataValues.Name,
                                    address: data.dataValues.Address,
                                    email: data.dataValues.Email,
                                    role: Constant.COMPANY_ROLE.PARENT
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

    addChildCompanyByID: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mCompanyChild(db).create({
                            ParentID: body.companyID,
                            ChildID: body.companyAddID,
                        }).then(() => {
                            mCompany(db).findOne({ where: { ID: body.companyAddID } }).then(data => {
                                var obj = {
                                    id: data.dataValues.ID,
                                    name: data.dataValues.Name,
                                    address: data.dataValues.Address,
                                    email: data.dataValues.Email,
                                    role: Constant.COMPANY_ROLE.CHILD
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

    assignCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.companyIDs) {
                            let listCompany = JSON.parse(body.companyIDs);
                            let listCompanyID = [];
                            listCompany.forEach(item => {
                                listCompanyID.push(Number(item + ""));
                            })

                            mCompany(db).update(
                                { UserID: body.assignID },
                                { where: { ID: { [Op.in]: listCompanyID } } }
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

    followCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        mUserFollow(db).findOne({ where: { UserID: body.userID, CompanyID: body.companyID, Type: 1 } }).then(data => {
                            if (data) {
                                mUserFollow(db).update(
                                    { Follow: Boolean(body.follow) },
                                    { where: { UserID: body.userID, CompanyID: body.companyID, Type: 1 } }
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
                                    CompanyID: body.companyID,
                                    Type: 1,
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

    deleteCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.companyIDs) {
                            let listCompany = JSON.parse(body.companyIDs);
                            let listcompanyID = [];
                            listCompany.forEach(item => {
                                listcompanyID.push(Number(item + ""));
                            });

                            mUser(db).findOne({ where: { ID: body.userID } }).then(user => {
                                if (user.dataValues.Roles == Constant.USER_ROLE.MANAGER) {
                                    rmCompanyChild(db).update(
                                        { CompanyID: null },
                                        { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                    ).then(() => {
                                        rmCall(db).update(
                                            { CompanyID: null },
                                            { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                        ).then(() => {
                                            rmEmail(db).update(
                                                { CompanyID: null },
                                                { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                            ).then(() => {
                                                rmMeet(db).update(
                                                    { CompanyID: null },
                                                    { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                                ).then(() => {
                                                    rmNote(db).update(
                                                        { CompanyID: null },
                                                        { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                                    ).then(() => {
                                                        rmContact(db).update(
                                                            { CompanyID: null },
                                                            { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                                        ).then(() => {
                                                            rmDeal(db).update(
                                                                { CompanyID: null },
                                                                { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                                            ).then(() => {
                                                                rmUserFlow(db).update(
                                                                    { CompanyID: null },
                                                                    { where: { CompanyID: { [Op.in]: listcompanyID } } }
                                                                ).then(() => {
                                                                    mCompany(db).destroy({ where: { ID: { [Op.in]: listcompanyID } } }).then(() => {
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
                                } else {
                                    mCompany(db).update({ UserID: null }, { where: { ID: { [Op.in]: listcompanyID } } }).then(() => {
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

    deleteContactFromCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        rmContact(db).update(
                            { CompanyID: null },
                            { where: { ID: body.contactID } }
                        ).then(() => {
                            res.json(Result.ACTION_SUCCESS)
                        })
                    })
                })
            } else {
                res.json()
            }
        })
    },

    deleteCompanyFromCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        if (body.role == Constant.COMPANY_ROLE.PARENT) {
                            mCompany(db).update(
                                { ParentID: null },
                                { where: { ID: body.companyID } }
                            ).then(() => {
                                res.json(Result.ACTION_SUCCESS)
                            });
                        }
                        else if (body.role == Constant.COMPANY_ROLE.CHILD) {
                            mCompanyChild(db).destroy({
                                where: { ParentID: body.companyID, ChildID: body.companyIDRemove }
                            }).then(() => {
                                res.json(Result.ACTION_SUCCESS)
                            })
                        }
                    })
                })
            } else {
                res.json()
            }
        })
    },

    deleteDealFromCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        rmDeal(db).destroy({ where: { ID: body.dealID } }).then(() => {
                            res.json(Result.ACTION_SUCCESS)
                        });
                    })
                })
            } else {
                res.json()
            }
        })
    },

}