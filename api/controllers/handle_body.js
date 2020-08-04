let mAdditionalInformation = require('../tables/additional-infomation');
let mTemplate = require('../tables/template');
var mMailListDetail = require('../tables/mail-list-detail');
var mMailList = require('../tables/mail-list');
var mMailCampain = require('../tables/mail-campain');
var database = require('../db');
const result = require('../constants/result');

function getDataInformation(db, ID) {
    var result = mAdditionalInformation(db).findOne({
        where: { ID: ID },
    })
    return result
}

function handlPushDataTobody(text, listKey, obj_information) {
    var result = text;
    listKey.forEach(item => {
        var re = RegExp('<<' + item + '>>', 'g');
        result = result.replace(re, obj_information[item]);
    })
    return result;
}

module.exports = {
    handlePushDataToBody: (req, res) => {
        let body = req.body;
        database.checkServerInvalid(body.ip, body.dbName, body.secretKey).then(async db => {
            const text = body.body;
            const re = RegExp('<<(.*?)>>', 'g');
            const keyField = []
            while ((matches = re.exec(text)) !== null) {
                keyField.push(matches[1]);
            }
            let obj_information = await getDataInformation(db, body.ID);
            var result = handlPushDataTobody(text, keyField, obj_information.dataValues);
            res.json(result);
        })
    }
}