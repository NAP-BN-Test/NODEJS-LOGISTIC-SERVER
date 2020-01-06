module.exports = function (app) {
    var controller = require('./controllers/controller');
    var svController = require('./controllers/server-controller');

    // todoList Routes
    app.route('/fcms').post(controller.fcm);

    app.route('/server/add_user').post(svController.addUser);

};