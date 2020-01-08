const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Notes', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Description: Sequelize.STRING,
        TimeRemind: Sequelize.DATE,
        UserID: Sequelize.BIGINT,
        TimeCreate: Sequelize.DATE
    });

    return table;
}