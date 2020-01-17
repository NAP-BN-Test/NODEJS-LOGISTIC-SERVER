const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mCompany = require('../tables/company');
var mCompanyChild = require('../tables/company-child');
var mDeal = require('../tables/deal');



module.exports = {
    getListCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        mCompany(db).findAll().then(data => {
                            var array = [];

                            data.forEach(elm => {
                                array.push({
                                    id: elm['ID'],
                                    name: elm['Name'],
                                    email: elm['Email'],
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


}