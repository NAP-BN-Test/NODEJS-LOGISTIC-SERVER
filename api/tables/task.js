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
        CompanyID: Sequelize.BIGINT,
        AssignID: Sequelize.BIGINT,
        UserID: Sequelize.BIGINT,
        Name: Sequelize.STRING,
        Status: Sequelize.BOOLEAN,

        TimeCreate: Sequelize.DATE,
        TimeStart: Sequelize.DATE,
        TimeAssign: Sequelize.DATE,
        TimeRemind: Sequelize.DATE,

        Description: Sequelize.STRING,
    });

    return table;
}