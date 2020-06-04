var nodemailer = require('nodemailer');

function sendEmail() {

    let emailMarkup = `<p>Bây giờ là cơ hội tốt nhất để chuyển đổi số!</p>` +
        `<img src="http://163.44.192.123:3302/crm/test1" height="1" width="1""/>`;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'Info.namanphu@gmail.com',
            pass: 'Nap123456a$'
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'NAP LOCY',
        to: 'a3fiend@gmail.com',
        subject: 'Thông tin, tải xuống phần mềm LOCY',
        html: emailMarkup
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info);
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

    test1: (req, res) => {

        let query = req._parsedUrl.query;

        console.log(req._parsedUrl.query);

        console.log("ngu");
        res.json("ngu1");

    }
}