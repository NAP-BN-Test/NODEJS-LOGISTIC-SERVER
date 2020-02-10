const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Cities', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        CountryID: Sequelize.BIGINT,
        Code: Sequelize.STRING,
        NameVI: Sequelize.STRING,
        NameEN: Sequelize.STRING
    });

    return table;
}