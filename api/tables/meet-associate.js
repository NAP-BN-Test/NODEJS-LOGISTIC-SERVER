const Sequelize = require('sequelize');

module.exports = function (db) {
    var table = db.define('MeetAssociate', {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        UserID: Sequelize.BIGINT,
        ActivityID: Sequelize.BIGINT

    });

    return table;
}