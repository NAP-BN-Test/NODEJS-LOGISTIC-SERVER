const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Calls', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ContactID: Sequelize.BIGINT,
        CompanyID: Sequelize.BIGINT,
        State: Sequelize.INTEGER,
        TimeCreate: Sequelize.DATE,
        TimeStart: Sequelize.DATE,
        Description: Sequelize.STRING,
        TimeRemind: Sequelize.DATE,
        UserID: Sequelize.BIGINT
    });

    return table;
}