const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Meets', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        UserID: Sequelize.BIGINT,
        CompanyID: Sequelize.BIGINT,
        Duration: Sequelize.FLOAT,
        TimeCreate: Sequelize.DATE,
        TimeStart: Sequelize.DATE,
        TimeRemind: Sequelize.DATE,
        Description: Sequelize.STRING,
    });

    return table;
}