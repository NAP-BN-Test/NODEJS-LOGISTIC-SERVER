const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Companies', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        NameVI: Sequelize.STRING,
        NameEN: Sequelize.STRING,
        Email: Sequelize.STRING,
        Address: Sequelize.STRING,
        ParentID: Sequelize.BIGINT,
        UserID: Sequelize.BIGINT
    });

    return table;
}