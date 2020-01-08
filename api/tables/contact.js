const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Contacts', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        NameVI: Sequelize.STRING,
        NameEN: Sequelize.STRING,
        Email: Sequelize.STRING,
        HandPhone: Sequelize.STRING,
        Owner: Sequelize.STRING,
        AssociatCompany: Sequelize.STRING,
        LastActivity: Sequelize.DATE,
        CreateTime: Sequelize.DATE,
        Type: Sequelize.INTEGER,
        UserID: Sequelize.BIGINT,
        CompanyID: Sequelize.BIGINT,
        JobTile: Sequelize.INTEGER
    });

    return table;
}