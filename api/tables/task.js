const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Tasks', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Type: Sequelize.INTEGER,
        ContactID: Sequelize.BIGINT,
        TimeCreate: Sequelize.DATE,
        AssignTo: Sequelize.BIGINT,
        Description: Sequelize.STRING,
        TimeRemind: Sequelize.DATE,
        UserID: Sequelize.BIGINT
    });

    return table;
}