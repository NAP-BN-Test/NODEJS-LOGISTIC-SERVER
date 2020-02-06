// const Constant = require('../constants/constant');
// const Result = require('../constants/result');

// var database = require('../db');

// var mDeal = require('../tables/deal');
// var mDealStage = require('../tables/deal-stage');


// module.exports = {

//     checkUser:function (req, res) => {
//         let body = req.body;

//         database.serverDB(body.ip, body.username, body.dbName).then(server => {
//             if (server) {
//                 database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

//                     db.authenticate().then(() => {
//                         var deal = mDeal(db);
//                         deal.belongsTo(mDealStage(db), { foreignKey: 'StageID', sourceKey: 'StageID' });

//                         deal.findAll({
//                             where: { CompanyID: body.companyID },
//                             include: { model: mDealStage(db) }
//                         }).then(data => {
//                             var array = [];
//                             data.forEach(elm => {
//                                 array.push({
//                                     id: elm.dataValues.ID,
//                                     timeCreate: elm.dataValues.TimeCreate,
//                                     timeClose: elm.dataValues.TimeClose,
//                                     amount: elm.dataValues.Amount,
//                                     stageID: elm.DealStage.dataValues.Stage
//                                 })
//                             });
//                             var result = {
//                                 status: Constant.STATUS.SUCCESS,
//                                 message: '',
//                                 array: array
//                             }
//                             res.json(result)
//                         }).catch(() => {
//                             res.json(Result.SYS_ERROR_RESULT);
//                         })
//                     }).catch(() => {
//                         res.json(Result.SYS_ERROR_RESULT);
//                     })
//                 })
//             } else {
//                 res.json(Result.SYS_ERROR_RESULT);
//             }
//         })
//     },
// }