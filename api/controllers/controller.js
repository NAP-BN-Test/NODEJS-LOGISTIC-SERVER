var database = require('../db');

var fcm = require('../tables/fcm');
var user = require('../tables/user');

module.exports = {
    fcm: (req, res) => {
        let body = req.body;

        database.serverDB(body.ip, body.username).then(server => {
            if (server) {
                database.mainDB(server.ip, server.dbName, server.username, server.password).then(db => {

                    db.authenticate().then(() => {

                        fcm(db).belongsTo(user(db), { foreignKey: 'UserID' });

                        user(db).findOne({ where: { ID: body.userID } }).then(userItem => {
                            fcm(db).findAll({ where: { UserID: Number(userItem.ID) } }).then(fcmItem => {
                                res.json(fcmItem)
                            })
                        })

                    }).catch(err => res.json(err))
                })
            }else {
                res.json()
            }

        })

    }
}