const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Companies', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Name: Sequelize.STRING,
        Email: Sequelize.STRING,
        Address: Sequelize.STRING,
        ParentID: Sequelize.BIGINT,
        UserID: Sequelize.BIGINT,
        ShortName: Sequelize.STRING,
        Phone: Sequelize.STRING,
        CityID: Sequelize.STRING,
    });

    return table;
}