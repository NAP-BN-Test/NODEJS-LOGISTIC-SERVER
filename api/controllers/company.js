const Op = require('sequelize').Op;

var moment = require('moment');

const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');
var user = require('../controllers/user');


var mCity = require('../tables/ city');

var mCompany = require('../tables/company');
var mContact = require('../tables/contact');
var mCompanyChild = require('../tables/company-child');
var mUser = require('../tables/user');
var mUserFollow = require('../tables/user-follow');
var mDeal = require('../tables/deal');
var mDealStage = require('../tables/deal-stage');

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

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        console.log(body);

                        mUser(db).findOne({ where: { ID: body.userID } }).then(user => {
                            if (user) {
                                let company = mCompany(db);
                                company.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID', as: 'CreateUser' });
                                company.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID', as: 'AssignUser' });
                                company.belongsTo(mCity(db), { foreignKey: 'CityID', sourceKey: 'CityID' });
                                company.belongsTo(mDealStage(db), { foreignKey: 'StageID', sourceKey: 'StageID' });

                                company.hasMany(mUserFollow(db), { foreignKey: 'CompanyID' })
                                company.hasMany(mDeal(db), { foreignKey: 'CompanyID' });

                                let whereSearch = [];
                                if (body.searchKey) {
                                    whereSearch = [
                                        { Name: { [Op.like]: '%' + body.searchKey + '%' } },
                                        { Address: { [Op.like]: '%' + body.searchKey + '%' } },
                                        { Phone: { [Op.like]: '%' + body.searchKey + '%' } },
                                        { ShortName: { [Op.like]: '%' + body.searchKey + '%' } },
                                    ];
                                } else {
                                    whereSearch = [
                                        { Name: { [Op.ne]: '%%' } },
                                        { Address: { [Op.like]: '%%' } },
                                        { Phone: { [Op.like]: '%%' } },
                                        { ShortName: { [Op.like]: '%%' } },
                                    ];
                                }

                                let userFind = [];
                                if (body.userIDFind) {
                                    userFind.push({ UserID: body.userIDFind })
                                }
                                if (body.stageID) {
                                    userFind.push({ StageID: body.stageID })
                                }
                                if (body.cityID) {
                                    userFind.push({ CityID: body.cityID })
                                }
                                if (user['Roles'] == Constant.USER_ROLE.GUEST) {
                                    userFind.push({ UserID: body.userID })
                                }

                                let whereAll;
                                let whereAllAssign;
                                let whereAssign;
                                let whereUnAssign;
                                let whereFollow
                                if (body.timeFrom) {
                                    whereAll = {
                                        TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                        [Op.or]: whereSearch,
                                        [Op.and]: userFind
                                    };
                                    whereAllAssign = {
                                        UserID: { [Op.ne]: null },
                                        [Op.or]: whereSearch,
                                        TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                        [Op.and]: userFind
                                    };
                                    whereAssign = {
                                        UserID: body.userID,
                                        [Op.or]: whereSearch,
                                        TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                        [Op.and]: userFind
                                    };
                                    whereUnAssign = {
                                        UserID: { [Op.eq]: null },
                                        [Op.or]: whereSearch,
                                        TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                        [Op.and]: userFind
                                    };
                                    whereFollow = {
                                        [Op.or]: whereSearch,
                                        TimeCreate: { [Op.between]: [new Date(body.timeFrom), new Date(body.timeTo)] },
                                        [Op.and]: userFind
                                    }
                                } else {
                                    whereAll = {
                                        [Op.or]: whereSearch,
                                        [Op.and]: userFind
                                    };
                                    whereAllAssign = {
                                        UserID: { [Op.ne]: null },
                                        [Op.or]: whereSearch,
                                        [Op.and]: userFind
                                    };
                                    whereAssign = {
                                        UserID: body.userID,
                                        [Op.or]: whereSearch,
                                        [Op.and]: userFind
                                    };
                                    whereUnAssign = {
                                        UserID: { [Op.eq]: null },
                                        [Op.or]: whereSearch,
                                        [Op.and]: userFind
                                    };
                                    whereFollow = {
                                        [Op.or]: whereSearch,
                                        [Op.and]: userFind
                                    }
                                }

                                company.count({
                                    where: whereAll
                                }).then(all => {
                                    company.count({
                                        where: whereUnAssign,
                                    }).then(unassign => {
                                        company.count({
                                            where: whereAllAssign
                                        }).then(assignAll => {
                                            company.count({
                                                where: whereAssign,
                                            }).then(assign => {
                                                company.count({
                                                    include: [
                                                        {
                                                            model: mUserFollow(db),
                                                            where: { UserID: body.userID, Type: 1, Follow: true }
                                                        }
                                                    ],
                                                    where: whereFollow,
                                                }).then(follow => {

                                                    let where;
                                                    if (body.searchKey) {
                                                        if (body.companyType == 2) {//unassign
                                                            where = whereUnAssign
                                                        } else if (body.companyType == 4) {//assign
                                                            where = whereAssign
                                                        } else if (body.companyType == 5) {//assign all
                                                            where = whereAllAssign
                                                        } else { // all
                                                            where = whereAll
                                                        }
                                                    } else {
                                                        if (body.companyType == 2) {//unassign
                                                            where = whereUnAssign
                                                        } else if (body.companyType == 4) {//assign
                                                            where = whereAssign
                                                        } else {// all
                                                            where = whereAll
                                                        }
                                                    }
                                                    company.findAll({
                                                        include: [
                                                            { model: mUser(db), required: false, as: 'CreateUser' },
                                                            { model: mUser(db), required: false, as: 'AssignUser' },
                                                            {
                                                                model: mUserFollow(db),
                                                                required: body.companyType == 3 ? true : false,
                                                                where: { UserID: body.userID, Type: 1, Follow: true }
                                                            },
                                                            { model: mCity(db), required: false },
                                                            {
                                                                model: mDealStage(db),
                                                                required: false,
                                                            }
                                                        ],
                                                        where: where,
                                                        order: [['ID', 'DESC']],
                                                        offset: 12 * (body.page - 1),
                                                        limit: 12
                                                    }).then(data => {
                                                        var array = [];
                                                        data.forEach(elm => {
                                                            array.push({
                                                                id: elm.dataValues.ID,
                                                                name: elm.dataValues.Name,

                                                                ownerID: elm.dataValues.UserID,
                                                                ownerName: elm.dataValues.CreateUser ? elm.dataValues.CreateUser.dataValues.Username : "",

                                                                assignID: elm.dataValues.AssignID,
                                                                assignName: elm.dataValues.AssignUser ? elm.dataValues.AssignUser.dataValues.Username : "",

                                                                address: elm.dataValues.Address,
                                                                phone: elm.dataValues.Phone,
                                                                website: elm.dataValues.Website,
                                                                timeCreate: elm.dataValues.TimeCreate,

                                                                cityID: elm.dataValues.City ? elm.dataValues.City.ID : -1,
                                                                city: elm.dataValues.City ? elm.dataValues.City.NameVI : "",

                                                                follow: elm.dataValues.UserFollows[0] ? elm.dataValues.UserFollows[0]['Follow'] : false,
                                                                checked: false,
                                                                companyType: elm.dataValues.Type,
                                                                stageID: elm.DealStage ? elm.DealStage.dataValues.ID : -1,
                                                                stageName: elm.DealStage ? elm.DealStage.dataValues.Name : ""
                                                            })
                                                        });

                                                        var result = {
                                                            status: Constant.STATUS.SUCCESS,
                                                            message: '',
                                                            array: array,
                                                            all, unassign, assign, follow, assignAll
                                                        }
                                                        res.json(result)
                                                    });
                                                });
                                            });
                                        })
                                    });
                                });
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

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        let company = mCompany(db);
                        company.belongsTo(mCity(db), { foreignKey: 'CityID', sourceKey: 'CityID' });
                        company.belongsTo(mDealStage(db), { foreignKey: 'StageID', sourceKey: 'StageID' });

                        company.hasMany(mUserFollow(db), { foreignKey: 'CompanyID' })

                        company.findOne({
                            where: { ID: body.companyID },
                            include: [
                                {
                                    model: mUserFollow(db),
                                    required: false,
                                    where: { UserID: body.userID, Type: 1 }
                                },
                                { model: mCity(db), required: false },
                                {
                                    model: mDealStage(db),
                                    required: false,
                                }
                            ]
                        }).then(data => {
                            var obj = {
                                id: data['ID'],
                                name: data['Name'],
                                shortName: data['ShortName'],
                                address: data['Address'],
                                phone: data['Phone'],
                                email: data['Email'],
                                website: data['Website'],
                                cityID: data.dataValues.City ? data.dataValues.City.ID : -1,
                                city: data.dataValues.City ? data.dataValues.City.NameVI : "",
                                follow: data.dataValues.UserFollows[0] ? data.dataValues.UserFollows[0]['Follow'] : false,
                                stageID: data.DealStage ? data.DealStage.dataValues.ID : -1,
                                stageName: data.DealStage ? data.DealStage.dataValues.Name : ""
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        let listUpdate = [];

                        if (body.companyName)
                            listUpdate.push({ key: 'Name', value: body.companyName });

                        if (body.companyShortName)
                            listUpdate.push({ key: 'ShortName', value: body.companyShortName });

                        if (body.companyAddress)
                            listUpdate.push({ key: 'Address', value: body.companyAddress });

                        if (body.companyPhone)
                            listUpdate.push({ key: 'Phone', value: body.companyPhone });

                        if (body.companyEmail)
                            listUpdate.push({ key: 'Email', value: body.companyEmail });

                        if (body.companyCity)
                            listUpdate.push({ key: 'CityID', value: body.companyCity });

                        if (body.website)
                            listUpdate.push({ key: 'Website', value: body.website });

                        if (body.stageID)
                            listUpdate.push({ key: 'StageID', value: body.stageID });

                        let update = {};
                        for (let field of listUpdate) {
                            update[field.key] = field.value
                        }

                        mCompany(db).update(update, { where: { ID: body.companyID } }).then(() => {
                            res.json(Result.ACTION_SUCCESS)
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

    searchCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        user.checkUser(body.ip, body.dbName, body.username).then(role => {

                            let where = [{ Name: { [Op.like]: "%" + body.searchKey + "%" } }]
                            if (role != Constant.USER_ROLE.MANAGER) {
                                where.push({ UserID: body.userID })
                            }

                            mCompany(db).findAll({ where: where, limit: 20 }).then(data => {
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
                })
            } else {
                res.json()
            }
        })
    },

    addCompany: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.dbName).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {
                        var company = mCompany(db);
                        company.belongsTo(mCity(db), { foreignKey: 'CityID', sourceKey: 'CityID' });

                        company.create({
                            UserID: body.userID,
                            Name: body.name,
                            ShortName: body.shortName,
                            Phone: body.phone,
                            Email: body.email,
                            Address: body.address,
                            CityID: body.cityID,
                            TimeCreate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                            Type: 1
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
                                    city: body.cityName,
                                    ownerID: -1,
                                    ownerName: "",
                                    companyType: data.dataValues.Type
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
                                    city: body.cityName,
                                    ownerID: -1,
                                    ownerName: "",
                                    companyType: data.dataValues.Type
                                }
                            } else {
                                obj = {
                                    id: data.dataValues.ID,
                                    name: data.dataValues.Name,
                                    address: data.dataValues.Address,
                                    email: data.dataValues.Email,
                                    role: -1,
                                    phone: data.dataValues.Phone,
                                    city: body.cityName,
                                    ownerID: -1,
                                    ownerName: "",
                                    companyType: data.dataValues.Type
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.dbName).then(server => {
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
                                { AssignID: body.assignID != -1 ? body.assignID : null },
                                { where: { ID: { [Op.in]: listCompanyID } } }
                            ).then(data => {
                                if (data) {
                                    if (body.assignID != -1) {
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
                                    } else {
                                        res.json(Result.ACTION_SUCCESS)
                                    }
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

        database.serverDB(body.ip, body.dbName).then(server => {
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

    createCompanyTrailer: (req, res) => {
        let body = req.body;

        database.mainDB('163.44.192.123', 'LOGISTIC_CRM', 'logistic_crm', '123456a$').then(db => {

            db.authenticate().then(() => {
                mCompany(db).findOne({ where: { Name: body.companyName } }).then(company => {
                    if (!company) {
                        mCompany(db).create({
                            Name: body.companyName,
                            Email: body.companyEmail,
                            Address: body.companyAddress,
                            TimeCreate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                            Type: 0
                        }).then(data => {
                            mContact(db).create({
                                Name: body.contactName,
                                Phone: body.contactPhone,
                                CompanyID: data.dataValues.ID,
                                TimeCreate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                            }).then(() => {
                                res.json(Result.ACTION_SUCCESS)
                            }).catch(() => {
                                res.json(Result.SYS_ERROR_RESULT)
                            })
                        }).catch(() => {
                            res.json(Result.SYS_ERROR_RESULT)
                        })
                    } else {
                        let result = {
                            status: Constant.STATUS.FAIL,
                            message: Constant.MESSAGE.INVALID_COMPANY,
                        }
                        res.json(result)
                    }
                }).catch(() => {
                    res.json(Result.SYS_ERROR_RESULT)
                })
            }).catch(() => {
                res.json(Result.SYS_ERROR_RESULT)
            })
        }).catch(() => {
            res.json(Result.SYS_ERROR_RESULT)
        })
    },

}