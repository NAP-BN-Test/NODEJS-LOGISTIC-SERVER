const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Contacts', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Name: Sequelize.STRING,
        Email: Sequelize.STRING,
        HandPhone: Sequelize.STRING,
        TimeCreate: Sequelize.DATE,
        Type: Sequelize.INTEGER,
        UserID: Sequelize.BIGINT,
        CompanyID: Sequelize.BIGINT,
        JobTile: Sequelize.INTEGER,
        Gender: Sequelize.INTEGER,
        HomePhone: Sequelize.INTEGER,
        Address: Sequelize.INTEGER
    });

    return table;
}