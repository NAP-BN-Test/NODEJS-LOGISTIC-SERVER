const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('MailClickLink', {
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