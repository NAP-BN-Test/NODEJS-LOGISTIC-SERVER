const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('tblNhanSu', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        HoTenVI: Sequelize.STRING
    });

    return table;
}