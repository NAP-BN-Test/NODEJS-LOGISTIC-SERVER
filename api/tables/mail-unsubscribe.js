const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('MailUnsubscribe', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        MailListDetailID: Sequelize.BIGINT,
        TimeCreate: Sequelize.NOW,
        Reason: Sequelize.STRING
    });

    return table;
}