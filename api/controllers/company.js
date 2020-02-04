const Op = require('sequelize').Op;

const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mCompany = require('../tables/company');
var mCompanyChild = require('../tables/company-child');
var mUser = require('../tables/user');



module.exports = {
    getListCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        var company = mCompany(db);
                        company.belongsTo(mUser(db), { foreignKey: 'UserID' });

                        company.findAll({
                            include: { model: mUser(db) }
                        }).then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm['ID'],
                                    name: elm['Name'],
                                    email: elm.dataValues.User ? elm.dataValues.User.dataValues.Name : "",
                                    address: elm['Address'],
                                    phone: elm['Phone'],
                                    country: elm['Country'],
                                    assignID: elm['UserID'],
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
                                name: data['Name'],
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
                                array.push({
                                    id: data1.ID,
                                    name: data1.Name,
                                    address: data1.Address,
                                    email: data1.Email,
                                    role: 1
                                });
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
                                    role: Constant.COMPANY_ROLE.PARENT
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
                                    role: Constant.COMPANY_ROLE.CHILD
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
                        }).then(result => {
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
}