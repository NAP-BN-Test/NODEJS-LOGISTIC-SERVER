
const Op = require('sequelize').Op;
const Constant = require('../constants/constant');
const Result = require('../constants/result');

var database = require('../db');

var mUser = require('../tables/user');

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });


module.exports = {
    amazonResponse: (req, res) => {//take this list for dropdown
        let body = req.body;


        console.log(body);

        // database.checkServerInvalid(body.ip, body.dbName, '00a2152372fa8e0e62edbb45dd82831a').then(async db => {



        //     if (body.all) {
        //         mUser(db).findAll().then(data => {
        //             var array = [];

        //             data.forEach(elm => {
        //                 array.push({
        //                     id: elm['ID'],
        //                     name: elm['Name'],
        //                 })
        //             });
        //             var result = {
        //                 status: Constant.STATUS.SUCCESS,
        //                 message: '',
        //                 array: array
        //             }
        //             res.json(result)
        //         })
        //     } else {
        //         mUser(db).findAll({ where: { ID: { [Op.ne]: body.userID } } }).then(data => {
        //             var array = [];

        //             data.forEach(elm => {
        //                 array.push({
        //                     id: elm['ID'],
        //                     name: elm['Name'],
        //                 })
        //             });
        //             var result = {
        //                 status: Constant.STATUS.SUCCESS,
        //                 message: '',
        //                 array: array
        //             }
        //             res.json(result)
        //         })
        //     }


        // })
    },

    verifyEmail: (req, res) => {//take this list for dropdown
        let body = req.body;

        if (body.email) {
            var ses = new AWS.SES();

            var params = {
                EmailAddress: body.email
            };
            ses.verifyEmailIdentity(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else {
                    res.json(Result.ACTION_SUCCESS)
                }
            });
        }
    },

    sendEmail: (req, res) => {//take this list for dropdown
        let body = req.body;

        var ses = new AWS.SES();

        var params = {
            Destination: {
                BccAddresses: [], // bcc email
                CcAddresses: [], // cc email
                ToAddresses: [
                    "cuongdk.nap@gmail.com"
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Send test email"
                }
            },
            ReplyToAddresses: [],
            Source: "a2fiend@gmail.com",
        };
        ses.sendEmail(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
            /*
            data = {
             MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
            }
            */
        });
    },

}