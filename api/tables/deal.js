const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('Deals', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        State: Sequelize.INTEGER,
        TimeCreate: Sequelize.DATE,
        TimeClose: Sequelize.DATE,
        Amount: Sequelize.FLOAT,
        CompanyID: Sequelize.BIGINT,
        PipeLine: Sequelize.INTEGER,
        ContactID: Sequelize.BIGINT
    });

    return table;
}