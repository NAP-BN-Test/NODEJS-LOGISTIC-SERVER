const Sequelize = require('sequelize');

const Constant = require('../constants/constant');
const Result = require('../constants/result');

module.exports = {
    addUser: (req, res) => {
        let body = req.body;

        var dbServer = new Sequelize('CustomerDB', 'customeruser', '123456a$', {
            host: '163.44.192.123',
            dialect: 'mssql',
            operatorsAliases: '0',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            define: {
                timestamps: false,
                freezeTableName: true
            }
        });

        dbServer.authenticate().then(() => {
            var serverInfo = dbServer.define('LogisticServer', {
                ID: {
                    type: Sequelize.BIGINT,
                    primaryKey: true,
                    autoIncrement: true
                },
                IP: Sequelize.STRING,
                Username: Sequelize.STRING,
                Password: Sequelize.STRING,
                DBName: Sequelize.STRING,
            });

            let serverUser = dbServer.define('LogisticUser', {
                ID: {
                    type: Sequelize.BIGINT,
                    primaryKey: true,
                    autoIncrement: true
                },
                Username: Sequelize.STRING,
                ServerID: Sequelize.BIGINT
            });

            serverUser.belongsTo(serverInfo, { foreignKey: 'ServerID' });

            serverInfo.findOne({
                where: { IP: body.ip, DBName: body.dbName }
            }).then(data => {
                if (data.dataValues) {

                    serverUser.create({
                        Username: body.username,
                        ServerID: Number(data.dataValues.ID)
                    }).then(() => {
                        var result = {
                            status: Constant.STATUS.SUCCESS,
                            message: Constant.MESSAGE.ACTION_SUCCESS
                        }
                        res.json(result);
                    })
                }

            }).catch(() => {
                res.json(Result.NO_DATA_RESULT);
            })

        }).catch(() => {
            res.json(Result.ERROR_RESULT);
        })

    }
}