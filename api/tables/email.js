const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Emails', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ContactID: Sequelize.BIGINT,
        State: Sequelize.INTEGER,
        TimeCreate: Sequelize.DATE,
        Description: Sequelize.STRING,
        TimeRemind: Sequelize.DATE,
        UserID: Sequelize.BIGINT
    });

    return table;
}