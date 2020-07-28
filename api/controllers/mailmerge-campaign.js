const Constant = require('../constants/constant');
const Op = require('sequelize').Op;

const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');
var user = require('../controllers/user');
const modules = require('../constants/modules');

let mMailmergeCampaign = require('../tables/mailmerge-campaign');
let mAdditionalInformation = require('../tables/additional-infomation');
let mTemplate = require('../tables/template');

module.exports = {
    addMailmergeCampaign: (req, res) => {
        let body = req.body;
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            mMailmergeCampaign(db).create({
                Name: body.Name ? body.Name : null,
                Template_ID: body.Template_ID ? body.Template_ID : null,
                Create_Date: body.Create_Date ? body.Create_Date : null,
                Create_User: body.Create_User ? body.Create_User : null,
                Number_Adress: body.Number_Adress ? body.Number_Adress : null,
                UserID: body.UserID ? body.UserID : null,
                TimeStart: moment(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS') ? body.timeStart : null,
                TimeRemind: body.timeRemind ? moment(body.timeRemind).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                TimeCreate: now,
                TimeUpdate: now,
                Description: body.description,
            }).then(data => {
                obj = {
                    ID: data.ID,
                    Name: data.Name ? data.Name : null,
                    Template_ID: data.Template_ID ? data.Template_ID : null,
                    Create_Date: data.Create_Date ? data.Create_Date : null,
                    Create_User: data.Create_User ? data.Create_User : null,
                    Number_Adress: data.Number_Adress ? data.Number_Adress : null,
                    Description: data.Description ? data.Description : null,
                    UserID: data.UserID ? data.UserID : null,
                    TimeStart: data.timeStart ? data.timeStart : null,
                    TimeRemind: data.timeRemind ? data.timeRemind : null,
                    TimeCreate: data.TimeCreate,
                    TimeUpdate: data.TimeUpdate,
                }
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    obj: obj
                }
                res.json(result);
            }, err => {
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: Constant.MESSAGE.BINDING_ERROR,
                    ojb: err.fields
                }
                res.json(result);
            })
        })
    },
    updateMailmerge: (req, res) => {
        let body = req.body;
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {

            try {
                let update = [];
                if (body.Name)
                    update.push({ key: 'Name', value: body.Name });
                if (body.Template_ID)
                    update.push({ key: 'Template_ID', value: body.Template_ID });
                if (body.Create_Date)
                    update.push({ key: 'Create_Date', value: body.Create_Date });
                if (body.Create_User)
                    update.push({ key: 'Create_User', value: body.Create_User });
                if (body.Number_Adress)
                    update.push({ key: 'Number_Adress', value: body.Number_Adress });
                if (body.Description)
                    update.push({ key: 'Description', value: body.Description });
                if (body.UserID)
                    update.push({ key: 'UserID', value: body.UserID });
                if (body.TimeRemind)
                    update.push({ key: 'TimeRemind', value: body.TimeRemind });
                if (body.TimeStart)
                    update.push({ key: 'TimeStart', value: body.TimeStart });

                database.updateTable(update, mMailmergeCampaign(db), body.ID).then(response => {
                    if (response == 1) {
                        res.json(Result.ACTION_SUCCESS);
                    } else {
                        res.json(Result.SYS_ERROR_RESULT);
                    }
                })
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },
    getDetailMailmerge: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            mMailmergeCampaign(db).findOne({
                where: { ID: body.ID },
            }).then(data => {
                if (data) {
                    obj = {
                        ID: data.ID,
                        Name: data.Name ? data.Name : null,
                        Template_ID: data.Template_ID ? data.Template_ID : null,
                        Create_Date: data.Create_Date ? data.Create_Date : null,
                        Create_User: data.Create_User ? data.Create_User : null,
                        Number_Adress: data.Number_Adress ? data.Number_Adress : null,
                        Description: data.Description ? data.Description : null,
                        UserID: data.UserID ? data.UserID : null,
                        TimeStart: data.timeStart ? data.timeStart : null,
                        TimeRemind: data.timeRemind ? data.timeRemind : null,
                        TimeCreate: data.TimeCreate,
                        TimeUpdate: data.TimeUpdate,
                    }
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        obj: obj
                    }
                    res.json(result);
                }
                else {
                    var result = {
                        status: Constant.STATUS.FAIL,
                        message: Constant.MESSAGE.DATA_NOT_FOUND,
                    }
                    res.json(result);
                }
            })
        })
    },
    deleteMailmerge: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            mMailmergeCampaign(db).destroy({ where: { ID: body.ID } }).then(() => {
                res.json(Result.ACTION_SUCCESS);
            }, err => {
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: Constant.MESSAGE.BINDING_ERROR,
                    ojb: err.fields
                }
                res.json(result);
            });
        })
    },

    // --------------------- Template -----------------------------------------------------------
    addTemplate: (req, res) => {
        let body = req.body;
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            mTemplate(db).create({
                body: body.body ? body.body : null,
                dataID: body.dataID ? body.dataID : null,
                TimeStart: moment(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS') ? body.timeStart : null,
                TimeRemind: body.timeRemind ? moment(body.timeRemind).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                TimeCreate: now,
                TimeUpdate: now,
                Description: body.description
            }).then(data => {
                obj = {
                    ID: data.ID,
                    body: data.body ? data.body : null,
                    dataID: data.dataID ? data.dataID : null,
                    TimeStart: data.timeStart ? data.timeStart : null,
                    TimeRemind: data.timeRemind ? data.timeRemind : null,
                    TimeCreate: data.TimeCreate,
                    TimeUpdate: data.TimeUpdate,
                    Description: data.description ? data.description : null
                }
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    obj: obj
                }
                res.json(result);
            }, err => {
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: Constant.MESSAGE.BINDING_ERROR,
                    ojb: err.fields
                }
                res.json(result);
            })
        })
    },
    updateTemplate: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {

            try {
                let update = [];
                if (body.body)
                    update.push({ key: 'body', value: body.body });
                if (body.dataID)
                    update.push({ key: 'dataID', value: body.dataID });
                if (body.Description)
                    update.push({ key: 'Description', value: body.Description });
                if (body.UserID)
                    update.push({ key: 'UserID', value: body.UserID });
                if (body.TimeRemind)
                    update.push({ key: 'TimeRemind', value: body.TimeRemind });
                if (body.TimeStart)
                    update.push({ key: 'TimeStart', value: body.TimeStart });

                database.updateTable(update, mTemplate(db), body.ID).then(response => {
                    if (response == 1) {
                        res.json(Result.ACTION_SUCCESS);
                    } else {
                        res.json(Result.SYS_ERROR_RESULT);
                    }
                })
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },
    getDetailTemplate: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            mTemplate(db).findOne({
                where: { ID: body.ID },
            }).then(data => {
                if (data) {
                    obj = {
                        ID: data.ID,
                        body: data.body ? data.body : null,
                        dataID: data.dataID ? data.dataID : null,
                        TimeStart: data.timeStart ? data.timeStart : null,
                        TimeRemind: data.timeRemind ? data.timeRemind : null,
                        TimeCreate: data.TimeCreate,
                        TimeUpdate: data.TimeUpdate,
                        Description: data.description ? data.description : null
                    }
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        obj: obj
                    }
                    res.json(result);
                }
                else {
                    var result = {
                        status: Constant.STATUS.FAIL,
                        message: Constant.MESSAGE.DATA_NOT_FOUND,
                    }
                    res.json(result);
                }
            })
        })
    },
    deleteTemplate: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            mTemplate(db).destroy({ where: { ID: body.ID } }).then(() => {
                res.json(Result.ACTION_SUCCESS);
            }, err => {
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: Constant.MESSAGE.BINDING_ERROR,
                    ojb: err.fields
                }
                res.json(result);
            });
        })
    },
    // --------------------------AdditionalInfomation-----------------------------------------------------------------------------------------------
}