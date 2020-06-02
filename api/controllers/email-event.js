var nodemailer = require('nodemailer');

// const MongoClient = require('mongodb').MongoClient;

// var PxlForEmails = require('pxl-for-emails');
// let Pxl = require('pxl-mongodb');
// let pxl = new Pxl();
// pxl.connect('mongodb://localhost:27017/');

// let pxlForEmails = new PxlForEmails({
//     pxl,
//     getFullShortenedLink(linkId) {
//         return `https://localhost:3000/shortly/${linkId}`
//     }
// })

function sendEmail() {

    let emailMarkup = `<p>Email: <span style="color: #3366ff;">info.namanphu@gmail.com</span></p>
    <img src="http://192.168.1.10:3002/crm/test1" height="1" width="1""/>`;

    // mailMarkup = pxlForEmails.addTracking(emailMarkup, { recipient: 'a3fiend@gmail.com' })

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'a2fiend@gmail.com',
            pass: 'HJXHJX25031995'
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'NAP LOCY',
        to: 'a3fiend@gmail.com',
        subject: 'Thông tin, tải xuống phần mềm LOCY',
        text: 'You recieved message from NAP',
        html: emailMarkup
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: %s', info.messageId);
    });

    // console.log('bbbbbbbbbbbbbbbbbbbbbbbb', mailMarkup);

    // MongoClient.connect('mongodb://localhost:27017/', function (err, db) {

    //     if (err) throw err;
    //     var dbo = db.db("admin");

    //     var obj = {
    //         name: 'nguuu',
    //         host: '123'
    //     }

    //     dbo.collection('test').insertOne(obj, function (err, db) {
    //         // console.log(db);
    //     })
    // });
}

module.exports = {
    test: (req, res) => {

        sendEmail();
        res.json("ngu");

    },

    test1 : (req, res) => {
        console.log("ngu");
        res.json("ngu1");
        
    }
}