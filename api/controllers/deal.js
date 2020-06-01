const Constant = require('../constants/constant');
const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');

var mDeal = require('../tables/deal');
var mDealStage = require('../tables/deal-stage');


module.exports = {

    getListQuickDeal: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            var deal = mDeal(db);
            deal.belongsTo(mDealStage(db), { foreignKey: 'StageID', sourceKey: 'StageID' });

            deal.findAll({
                where: { CompanyID: body.companyID },
                include: { model: mDealStage(db) }
            }).then(data => {
                var array = [];
                data.forEach(elm => {
                    array.push({
                        id: elm.dataValues.ID,
                        timeCreate: elm.dataValues.TimeCreate,
                        timeClose: elm.dataValues.TimeClose,
                        amount: elm.dataValues.Amount,
                        stageID: elm.DealStage.dataValues.Stage
                    })
                });
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array: array
                }
                res.json(result)
            }).catch(() => {
                res.json(Result.SYS_ERROR_RESULT);
            })

        })
    },

    getListQuickDealForContact: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            var deal = mDeal(db);
            deal.belongsTo(mDealStage(db), { foreignKey: 'StageID', sourceKey: 'StageID' });

            deal.findAll({
                where: { ContactID: body.contactID },
                include: { model: mDealStage(db) }
            }).then(data => {
                var array = [];
                data.forEach(elm => {
                    array.push({
                        id: elm.dataValues.ID,
                        timeCreate: elm.dataValues.TimeCreate,
                        timeClose: elm.dataValues.TimeClose,
                        amount: elm.dataValues.Amount,
                        stageID: elm.DealStage.dataValues.Stage
                    })
                });
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array: array
                }
                res.json(result)
            }).catch(() => {
                res.json(Result.SYS_ERROR_RESULT);
            })

        })
    },

    getDealStage: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            mDealStage(db).findAll().then(data => {
                var array = [];
                data.forEach(elm => {
                    array.push({
                        id: elm.dataValues.ID,
                        name: elm.dataValues.Name,
                        process: elm.dataValues.Process,
                        stage: elm.dataValues.Stage
                    })
                });
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    array: array
                }
                res.json(result)
            }).catch(() => {
                res.json(Result.SYS_ERROR_RESULT);
            })

        })
    },

    addDeal: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            mDeal(db).create({
                UserID: body.userID,
                CompanyID: body.companyID ? body.companyID : null,
                ContactID: body.contactID,
                StageID: body.stageID,
                Name: body.name,
                TimeClose: moment(body.timeClose).format('YYYY-MM-DD HH:mm:ss.SSS'),
                TimeRemind: body.timeRemind ? moment(body.timeRemind).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                TimeCreate: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                Amount: body.amount,
            }).then(data => {
                var obj = {
                    id: data.dataValues.ID,
                    timeCreate: data.dataValues.TimeCreate,
                    timeClose: data.dataValues.TimeClose,
                    amount: body.amount,
                    stageID: body.stageID
                }
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: '',
                    obj: obj
                }
                res.json(result)
            })
        })

    },

    updateDeal: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {


            if (body.stageID) {
                mDeal(db).update(
                    { StageID: body.stageID },
                    { where: { ID: body.dealID } }
                ).then(() => {
                    res.json(Result.ACTION_SUCCESS)
                })
            }
        })

    },
}