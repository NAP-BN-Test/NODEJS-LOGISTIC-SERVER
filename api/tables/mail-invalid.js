const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('MailInvalid', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        MailListDetailID: Sequelize.BIGINT,
        TimeCreate: Sequelize.NOW,
        MailCampainID: Sequelize.BIGINT
    });

    return table;
}