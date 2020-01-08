module.exports = function (app) {
    var controller = require('./controllers/controller');
    var svController = require('./controllers/server-controller');

    // todoList Routes
    app.route('/fcms').post(controller.fcm);

    app.route('/server/add_user').post(svController.addUser);

    app.route('/crm/get_list_company').post(controller.getListCompany);

    app.route('/crm/get_detail_company').post(controller.getDetailCompany);

    app.route('/crm/get_list_quick_contact').post(controller.getListQuickContact);

    app.route('/crm/get_list_quick_company').post(controller.getListQuickCompany);

    app.route('/crm/get_list_quick_deal').post(controller.getListQuickDeal);

    app.route('/crm/get_list_activity').post(controller.getListActivity);

    app.route('/crm/get_list_contact').post(controller.getListContact);


};