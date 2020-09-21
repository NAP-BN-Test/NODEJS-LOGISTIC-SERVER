let mAdditionalInformation = require('../tables/additional-infomation');
let mTemplate = require('../tables/template');
var mMailListDetail = require('../tables/mail-list-detail');
var mMailList = require('../tables/mail-list');
var mMailCampain = require('../tables/mail-campain');
var database = require('../db');
const Result = require('../constants/result');
var mCheckMail = require('../controllers/check-mail');
var mAmazon = require('../controllers/amazon');
var mailmergerCampaingn = require('../controllers/mailmerge-campaign');

const result = require('../constants/result');

function getDataInformation(db, ID) {
    var result = mAdditionalInformation(db).findOne({
        where: { ID: ID },
    })
    return result
}

function handleReplaceText(text, listKey, obj_information) {
    var result = text;
    console.log(listKey);
    listKey.forEach(item => {
        var re = RegExp('&lt;&lt;' + item + '&gt;&gt;', 'g');
        result = result.replace(re, obj_information[item] ? obj_information[item] : '');
    })
    return result;
}
async function handlePushDataToBody(text, infID, db) {
    const re = RegExp('&lt;&lt;(.*?)&gt;&gt;', 'g');
    const keyField = []
    while ((matches = re.exec(text)) !== null) {
        keyField.push(matches[1]);
    }
    let obj_information = await getDataInformation(db, infID);
    var result = handleReplaceText(text, keyField, obj_information.dataValues);
    return result
}
function convertStringToListObject(string) {
    let result = [];
    let resultArray = [];
    if (string) {
        result = string.split(";")
        result.forEach(item => {
            let resultObj = {};
            resultObj.name = item;
            resultArray.push(resultObj);
        })
    }
    return resultArray;
}

module.exports = {
    sendMailList: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            var information = [];
            campaign = await mMailCampain(db).findOne({
                where: {
                    ID: body.CampaignID,
                }
            })
            template = await mTemplate(db).findOne({
                where: {
                    ID: campaign.TemplateID,
                }
            })
            information = await mailmergerCampaingn.getAdditionalInfomation(db, body.CampaignID);
            var bodyHtml;
            information.forEach(async item => {
                bodyHtml = await handlePushDataToBody(template.body, item.ID, db);
                let Subject = item.Subject ? item.Subject : '';
                var arrayEmail = convertStringToListObject(item.Email)
                arrayEmail.forEach(async data => {
                    console.log(bodyHtml);
                    var bodySend = new Buffer.from(bodyHtml, 'base64').toString('base64');
                    console.log(bodySend);
                    await mAmazon.sendEmail('tung24041998@gmail.com', data.name, Subject, bodySend);
                })
            })
            res.json(Result.ACTION_SUCCESS);
        })
    },
}