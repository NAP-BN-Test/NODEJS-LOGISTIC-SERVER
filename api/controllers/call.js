const Op = require('sequelize').Op;

const Constant = require('../constants/constant');
const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');
var user = require('../controllers/user');

var mUser = require('../tables/user');
var mContact = require('../tables/contact');
var mCompany = require('../tables/company');

var mCall = require('../tables/call');
var mAssociate = require('../tables/call-associate');
var mComment = require('../tables/call-comment');

var rmAssociate = require('../tables/call-associate');
var rmComment = require('../tables/call-comment');


module.exports = {

    createCall: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            var call = mCall(db);
            call.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });

            let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

            call.create({
                UserID: body.userID,
                CompanyID: body.companyID,
                ContactID: body.contactID,
                State: body.outcomeType,
                TimeStart: moment(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS'),
                TimeRemind: body.timeRemind ? moment(body.timeRemind).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                TimeCreate: now,
                TimeUpdate: now,
                Description: body.description,
            }, { include: [{ model: mContact(db) }] }).then(data => {

                if (body.companyID) {
                    var company = mCompany(db);
                    company.update({ LastActivity: now }, { where: { ID: body.CompanyID } })
                }
                if (body.contactID) {
                    var contact = mContact(db);
                    contact.update({ LastActivity: now }, { where: { ID: body.ContactID } })
                }

                if (body.listAssociate) {
                    let list = JSON.parse(body.listAssociate);
                    list.forEach(itm => {
                        mAssociate(db).create({ ActivityID: data.dataValues.ID, ContactID: itm });
                    });
                }
                var obj = {
                    id: data.dataValues.ID,
                    timeCreate: data.dataValues.TimeCreate,
                    timeRemind: data.dataValues.TimeRemind,
                    timeStart: data.dataValues.TimeStart,
                    contactID: data.dataValues.ContactID,
                    description: data.dataValues.Description,
                    state: data.dataValues.State,
                    activityType: Constant.ACTIVITY_TYPE.CALL,
                    listComment: []
                };

                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    obj: obj
                }

                res.json(result);
            })

        })
    },

    getAssociate: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            mAssociate(db).findAll({ where: { ActivityID: body.callID } }).then(data => {
                var array = [];

                data.forEach(elm => {
                    array.push({
                        callID: elm['ActivityID'],
                        contactID: elm['ContactID'],
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
    },

    updateAssociate: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            if (body.state == Constant.STATUS.SUCCESS) {
                mAssociate(db).create({ ActivityID: body.callID, ContactID: body.contactID }).then(data => {
                    res.json(Result.ACTION_SUCCESS)
                })
            } else {
                mAssociate(db).destroy({ where: { ActivityID: body.callID, ContactID: body.contactID } }).then(data => {
                    res.json(Result.ACTION_SUCCESS)
                })
            }

        })
    },

    getListCall: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            var call = mCall(db);

            call.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID' });
            call.belongsTo(mContact(db), { foreignKey: 'ContactID', sourceKey: 'ContactID' });
            call.belongsTo(mCompany(db), { foreignKey: 'CompanyID', sourceKey: 'CompanyID' });

            call.hasMany(mComment(db), { foreignKey: 'ActivityID', as: 'Comments' });


            user.checkUser(body.ip, body.dbName, body.username).then(role => {

                let userFind = [];
                if (body.userIDFind) {
                    userFind.push({ UserID: body.userIDFind })
                }
                if (role != Constant.USER_ROLE.MANAGER) {
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

                call.count({ where: whereAll }).then(all => {
                    call.findAll({
                        where: whereAll,
                        include: [
                            { model: mUser(db), required: false },
                            { model: mContact(db), required: false },
                            { model: mCompany(db), required: false },
                            { model: mComment(db), required: false, as: 'Comments' }
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
                                    state: item.dataValues.State,

                                    createID: item.User.dataValues ? item.User.dataValues.ID : -1,
                                    createName: item.User.dataValues ? item.User.dataValues.Username : "",

                                    contactID: item.dataValues.Contact ? item.dataValues.Contact.dataValues.ID : -1,
                                    contactName: item.dataValues.Contact ? item.dataValues.Contact.dataValues.Name : "",

                                    companyID: item.dataValues.Company ? item.dataValues.Company.dataValues.ID : -1,
                                    companyName: item.dataValues.Company ? item.dataValues.Company.dataValues.Name : "",

                                    type: item.dataValues.Company ? 1 : item.dataValues.Contact ? 2 : 0,
                                    activityType: Constant.ACTIVITY_TYPE.CALL,

                                    comment: item.Comments.length > 0 ? item.Comments[0].Contents : ""
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


        })
    },

    deleteCall: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            if (body.activityIDs) {
                let listActivity = JSON.parse(body.activityIDs);
                let listActivityID = [];
                listActivity.forEach(item => {
                    listActivityID.push(Number(item + ""));
                });
                rmAssociate(db).destroy({ where: { ActivityID: { [Op.in]: listActivityID } } }).then(() => {
                    rmComment(db).destroy({ where: { ActivityID: { [Op.in]: listActivityID } } }).then(() => {
                        mCall(db).destroy({ where: { ID: { [Op.in]: listActivityID } } }).then(() => {
                            res.json(Result.ACTION_SUCCESS);
                        })
                    })
                })
            }

        })
    },

}