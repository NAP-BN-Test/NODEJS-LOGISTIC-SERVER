const Constant = require('../constants/constant');
const Op = require('sequelize').Op;

const Result = require('../constants/result');

var moment = require('moment');

var database = require('../db');
let mUser = require('../tables/user');
var mModules = require('../constants/modules');
var mAmazon = require('../controllers/amazon');
var mCheckMail = require('../controllers/check-mail');


let mAdditionalInformation = require('../tables/additional-infomation');
var mMailListDetail = require('../tables/mail-list-detail');


module.exports = {
    getListAdditionalInformation: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            let AdditionalInformation = mAdditionalInformation(db);
            AdditionalInformation.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID', as: 'User' });
            AdditionalInformation.belongsTo(mUser(db), { foreignKey: 'OwnerID', sourceKey: 'OwnerID', as: 'Owner' });

            AdditionalInformation.count().then(all => {
                AdditionalInformation.findAll({
                    include: [
                        { model: mUser(db), required: false, as: 'User' },
                        { model: mUser(db), required: false, as: 'Owner' }
                    ],
                    order: [['TimeCreate', 'DESC']],
                    offset: Number(body.itemPerPage) * (Number(body.page) - 1),
                    limit: Number(body.itemPerPage)
                }).then(data => {
                    let array = [];
                    if (data) {
                        data.forEach(item => {
                            array.push({
                                ID: item.ID,
                                OurRef: item.OurRef ? item.OurRef : null,
                                PAT: item.PAT ? item.PAT : null,
                                Applicant: item.Create_ApplicantDate ? item.Applicant : null,
                                ApplicationNo: item.ApplicationNo ? item.ApplicationNo : null,
                                ClassA: item.ClassA ? item.ClassA : null,
                                FilingDate: moment(item.FilingDate).format('DD-MM-YYYY') ? item.FilingDate : null,
                                PriorTrademark: item.PriorTrademark ? item.PriorTrademark : null,
                                OwnerID: item.OwnerID ? item.OwnerID : null,
                                Owner: item.Owner ? item.Owner.Name : "",
                                RedNo: item.RedNo ? item.RedNo : null,
                                ClassB: item.ClassB ? item.ClassB : null,
                                Firm: item.Firm ? item.Firm : null,
                                Address: item.Address ? item.Address : null,
                                Tel: item.Tel ? item.Tel : null,
                                Fax: item.Fax ? item.Fax : null,
                                Email: item.Email ? item.Email : null,
                                Status: item.Status ? item.Status : null,
                                Rerminder: item.Rerminder ? item.Rerminder : null,
                                UserID: item.UserID ? item.UserID : null,
                                UserName: item.User ? item.User.Name : "",
                                TimeStart: mModules.toDatetime(item.timeStart) ? item.timeStart : null,
                                TimeRemind: mModules.toDatetime(item.timeRemind) ? item.timeRemind : null,
                                TimeCreate: mModules.toDatetime(item.TimeCreate),
                                TimeUpdate: mModules.toDatetime(item.TimeUpdate),
                                Description: mModules.toDatetime(item.description),
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
        })
    },
    addAdditionalInformation: (req, res) => {
        let body = req.body;
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            let errorEmail = '';
            await mCheckMail.checkEmail(body.Email).then(async (checkMailRes) => {
                if (checkMailRes == false) {
                    errorEmail = Constant.MAIL_RESPONSE_TYPE.INVALID;
                }
            })
            mAdditionalInformation(db).create({
                OurRef: body.OurRef ? body.OurRef : null,
                PAT: body.PAT ? body.PAT : null,
                Applicant: body.Create_ApplicantDate ? body.Applicant : null,
                ApplicationNo: body.ApplicationNo ? body.ApplicationNo : null,
                ClassA: body.ClassA ? body.ClassA : null,
                FilingDate: body.FilingDate ? body.FilingDate : null,
                PriorTrademark: body.PriorTrademark ? body.PriorTrademark : null,
                OwnerID: body.OwnerID ? body.OwnerID : null,
                RedNo: body.RedNo ? body.RedNo : null,
                ClassB: body.ClassB ? body.ClassB : null,
                Firm: body.Firm ? body.Firm : null,
                Address: body.Address ? body.Address : null,
                Tel: body.Tel ? body.Tel : null,
                Fax: body.Fax ? body.Fax : null,
                Email: body.Email ? body.Email : null,
                Status: body.Status ? body.Status : null,
                Rerminder: body.Rerminder ? body.Rerminder : null,
                UserID: body.UserID ? body.UserID : null,
                TimeStart: moment(body.timeStart).format('YYYY-MM-DD HH:mm:ss.SSS') ? body.timeStart : null,
                TimeRemind: body.timeRemind ? moment(body.timeRemind).format('YYYY-MM-DD HH:mm:ss.SSS') : null,
                TimeCreate: now,
                TimeUpdate: now,
                Description: body.description,
            }).then(async data => {
                obj = {
                    OurRef: data.OurRef ? data.OurRef : null,
                    PAT: data.PAT ? data.PAT : null,
                    Applicant: data.Create_ApplicantDate ? data.Applicant : null,
                    ApplicationNo: data.ApplicationNo ? data.ApplicationNo : null,
                    ClassA: data.ClassA ? data.ClassA : null,
                    FilingDate: data.FilingDate ? data.FilingDate : null,
                    PriorTrademark: data.PriorTrademark ? data.PriorTrademark : null,
                    OwnerID: data.OwnerID ? data.OwnerID : null,
                    RedNo: data.RedNo ? data.RedNo : null,
                    ClassB: data.ClassB ? data.ClassB : null,
                    Firm: data.Firm ? data.Firm : null,
                    Address: data.Address ? data.Address : null,
                    Tel: data.Tel ? data.Tel : null,
                    Fax: data.Fax ? data.Fax : null,
                    Email: data.Email ? data.Email : null,
                    Status: data.Status ? data.Status : null,
                    Rerminder: data.Rerminder ? data.Rerminder : null,
                    UserID: data.UserID ? data.UserID : null,
                    TimeStart: mModules.toDatetime(data.timeStart) ? data.timeStart : null,
                    TimeRemind: mModules.toDatetime(data.timeRemind) ? data.timeRemind : null,
                    TimeCreate: mModules.toDatetime(data.TimeCreate),
                    TimeUpdate: mModules.toDatetime(data.TimeUpdate),
                    Description: mModules.toDatetime(data.description),
                }
                var result = {
                    status: Constant.STATUS.SUCCESS,
                    message: Constant.MESSAGE.ACTION_SUCCESS,
                    obj: obj,
                    emailExist: true ? errorEmail === '' : false

                }
                await mMailListDetail(db).create({
                    Email: data.Email ? data.Email : null,
                    OwnerID: data.UserID ? data.UserID : null,
                    TimeCreate: mModules.toDatetime(data.TimeCreate),
                    MailListID: body.MailListID,
                    Name: data.OurRef ? data.OurRef : null,
                    DataID: data.ID,
                }).then(data => {
                    console.log(data.ID);
                })
                res.json(result);
            }, err => {
                var result = {
                    status: Constant.STATUS.FAIL,
                    message: Constant.MESSAGE.BINDING_ERROR,
                    ojb: err.fields,
                    emailExist: true ? errorEmail === '' : false
                }
                res.json(result);
            })
        })
    },
    updateAdditionalInformation: (req, res) => {
        let body = req.body;
        console.log(body);
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            let errorEmail = '';
            await mCheckMail.checkEmail(body.Email).then(async (checkMailRes) => {
                if (checkMailRes == false) {
                    errorEmail = Constant.MAIL_RESPONSE_TYPE.INVALID;
                }
            })
            try {
                let update = [];
                if (body.OurRef !== 'null')
                    update.push({ key: 'OurRef', value: body.OurRef });
                if (body.PAT !== 'null')
                    update.push({ key: 'PAT', value: body.PAT });
                if (body.Applicant !== 'null')
                    update.push({ key: 'Applicant', value: body.Applicant });
                if (body.ApplicationNo !== 'null')
                    update.push({ key: 'ApplicationNo', value: body.ApplicationNo });
                if (body.ClassA !== 'null')
                    update.push({ key: 'ClassA', value: body.ClassA });
                if (body.FilingDate !== 'Invalid date') {
                    let time = moment(body.FilingDate).format('YYYY-MM-DD');
                    update.push({ key: 'FilingDate', value: time });
                }
                if (body.PriorTrademark !== 'null')
                    update.push({ key: 'PriorTrademark', value: body.PriorTrademark });
                if (body.OwnerID !== 'null')
                    update.push({ key: 'OwnerID', value: body.OwnerID });
                if (body.RedNo !== 'null')
                    update.push({ key: 'RedNo', value: body.RedNo });
                if (body.ClassB !== 'null')
                    update.push({ key: 'ClassB', value: body.ClassB });
                if (body.Firmb !== 'null')
                    update.push({ key: 'Firm', value: body.Firm });
                if (body.Address !== 'null')
                    update.push({ key: 'Address', value: body.Address });
                if (body.Tel !== 'null')
                    update.push({ key: 'Tel', value: body.Tel });
                if (body.Fax !== 'null')
                    update.push({ key: 'Fax', value: body.Fax });
                if (errorEmail === '')
                    update.push({ key: 'Email', value: body.Email });
                if (body.Status !== 'null')
                    update.push({ key: 'Status', value: body.Status });
                if (body.Rerminder !== 'null')
                    update.push({ key: 'Rerminder', value: body.Rerminder });
                if (body.userID)
                    update.push({ key: 'UserID', value: body.userID });
                if (body.Description !== 'null')
                    update.push({ key: 'Description', value: body.Description });

                database.updateTable(update, mAdditionalInformation(db), body.ID).then(response => {
                    if (response == 1) {
                        Result.ACTION_SUCCESS.emailExist = true ? errorEmail === '' : false
                        res.json(Result.ACTION_SUCCESS);
                    } else {
                        Result.SYS_ERROR_RESULT.emailExist = true ? errorEmail === '' : false
                        res.json(Result.SYS_ERROR_RESULT);
                    }
                })
            } catch (error) {
                console.log(error);
                res.json(Result.SYS_ERROR_RESULT)

            }
        })
    },
    getDetailAdditionalInformation: (req, res) => {
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            let AdditionalInformation = mAdditionalInformation(db);

            AdditionalInformation.belongsTo(mUser(db), { foreignKey: 'UserID', sourceKey: 'UserID', as: 'User' });
            AdditionalInformation.belongsTo(mUser(db), { foreignKey: 'OwnerID', sourceKey: 'OwnerID', as: 'Owner' });
            AdditionalInformation.findOne({
                include: [
                    { model: mUser(db), required: false, as: 'User' },
                    { model: mUser(db), required: false, as: 'Owner' }
                ],
                where: { ID: body.ID },
            }).then(data => {
                if (data) {
                    obj = {
                        ID: data.ID,
                        OurRef: data.OurRef ? data.OurRef : null,
                        PAT: data.PAT ? data.PAT : null,
                        Applicant: data.Create_ApplicantDate ? data.Applicant : null,
                        ApplicationNo: data.ApplicationNo ? data.ApplicationNo : null,
                        ClassA: data.ClassA ? data.ClassA : null,
                        FilingDate: data.FilingDate ? data.FilingDate : null,
                        PriorTrademark: data.PriorTrademark ? data.PriorTrademark : null,
                        OwnerID: data.OwnerID ? data.OwnerID : null,
                        Owner: data.Owner ? data.Owner.Name : "",
                        RedNo: data.RedNo ? data.RedNo : null,
                        ClassB: data.ClassB ? data.ClassB : null,
                        Firm: data.Firm ? data.Firm : null,
                        Address: data.Address ? data.Address : null,
                        Tel: data.Tel ? data.Tel : null,
                        Fax: data.Fax ? data.Fax : null,
                        Email: data.Email ? data.Email : null,
                        Status: data.Status ? data.Status : null,
                        Rerminder: data.Rerminder ? data.Rerminder : null,
                        UserID: data.UserID ? data.UserID : null,
                        UserName: data.User ? data.User.Name : "",
                        TimeStart: mModules.toDatetime(data.timeStart) ? data.timeStart : null,
                        TimeRemind: mModules.toDatetime(data.timeRemind) ? data.timeRemind : null,
                        TimeCreate: mModules.toDatetime(data.TimeCreate),
                        TimeUpdate: mModules.toDatetime(data.TimeUpdate),
                        Description: mModules.toDatetime(data.description)
                    }
                    var result = {
                        status: Constant.STATUS.SUCCESS,
                        message: '',
                        array: obj
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
    deleteAdditionalInformation: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {

            if (body.AdditionalInformationIDs) {
                let listAdditionalInformation = JSON.parse(body.AdditionalInformationIDs);
                let listAdditionalInformationID = [];
                listAdditionalInformation.forEach(item => {
                    listAdditionalInformationID.push(Number(item + ""));
                });

                mUser(db).findOne({ where: { ID: body.userID } }).then(async user => {
                    if (user.Roles == Constant.USER_ROLE.MANAGER) {
                        await mAdditionalInformation(db).destroy(
                            {
                                where: {
                                    [Op.or]: {
                                        ID: { [Op.in]: listAdditionalInformationID }
                                    }
                                }
                            },
                        ).then(() => {
                            res.json(Result.ACTION_SUCCESS);
                        });
                    }
                });
            }
        })
    },
    getAllAdditionalInformation: (req, res) => {//take this list for dropdown
        let body = req.body;

        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            mAdditionalInformation(db).findAll().then(data => {
                var array = [];

                data.forEach(elm => {
                    array.push({
                        id: elm['ID'],
                        OurRef: elm['OurRef'],
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
    },
}