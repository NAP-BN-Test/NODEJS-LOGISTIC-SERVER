const Sequelize = require('sequelize');

module.exports = {
  serverDB: function (username) {
    return new Promise((resolve) => {
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

        var serverUser = dbServer.define('LogisticUser', {
          ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
          },
          Username: Sequelize.STRING,
          ServerID: Sequelize.BIGINT
        });


        serverUser.belongsTo(serverInfo, { foreignKey: 'ServerID' });

        serverUser.findOne({
          where: { Username: username },
          raw: true,
          include: [{
            model: serverInfo
          }]
        }).then(data => {
          if (data) {
            var server = {
              ip: data['LogisticServer.IP'],
              dbName: data['LogisticServer.DBName'],
              username: data['LogisticServer.Username'],
              password: data['LogisticServer.Password']
            };
            resolve(server);
          }
        }).catch(() => resolve())
      }).catch(() => resolve())
    })


  },
  mainDB: function (ip, dbName, username, password) {
    return new Promise((resolve, reject) => {
      var db = new Sequelize(dbName, username, password, {
        host: ip,
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

      if (db)
        resolve(db);
      else
        reject();
    })
  }
}