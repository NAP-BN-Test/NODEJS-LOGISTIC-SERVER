const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('MailSend', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        MailListDetailID: Sequelize.BIGINT,
        TimeCreate: Sequelize.NOW,
    });

    return table;
}