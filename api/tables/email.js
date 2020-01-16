const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Emails', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        UserID: Sequelize.BIGINT,
        ContactID: Sequelize.BIGINT,
        CompanyID: Sequelize.BIGINT,
        State: Sequelize.INTEGER,
        TimeCreate: Sequelize.DATE,
        TimeRemind: Sequelize.DATE,
        TimeStart: Sequelize.DATE,
        Description: Sequelize.STRING,
    });

    return table;
}