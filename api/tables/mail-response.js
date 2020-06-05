const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('MailResponse', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        MailListDetailID: Sequelize.BIGINT,
        TimeCreate: Sequelize.NOW,
        Type: Sequelize.INTEGER,
        MailCampainID: Sequelize.BIGINT
    });

    return table;
}