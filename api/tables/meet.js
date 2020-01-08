const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Meets', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        UserID: Sequelize.BIGINT,
        Duration: Sequelize.FLOAT,
        TimeStart: Sequelize.DATE,
        Description: Sequelize.STRING,
        TimeRemind: Sequelize.DATE,
        AttendID: Sequelize.BIGINT
    });

    return table;
}