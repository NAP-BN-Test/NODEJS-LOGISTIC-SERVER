module.exports = function (app) {
    var controller = require('./controllers/controller');
    var login = require('./controllers/login');
    var activity = require('./controllers/activity');
    var svController = require('./controllers/server-controller');

    // todoList Routes
    app.route('/crm/user_login').post(login.login);

    app.route('/server/add_user').post(svController.addUser);

    app.route('/crm/get_list_company').post(controller.getListCompany);

    app.route('/crm/get_detail_company').post(controller.getDetailCompany);

    app.route('/crm/get_list_quick_contact').post(controller.getListQuickContact);

    app.route('/crm/get_list_quick_company').post(controller.getListQuickCompany);

    app.route('/crm/get_list_quick_deal').post(controller.getListQuickDeal);

    app.route('/crm/get_list_activity').post(activity.getListActivity);

    app.route('/crm/get_list_contact').post(controller.getListContact);

    app.route('/crm/get_list_contact_full').post(controller.getListContactFull);

    app.route('/crm/update_activity').post(activity.updateActivity);

    app.route('/crm/get_list_meet_attend').post(activity.getListMeetAttend);


};