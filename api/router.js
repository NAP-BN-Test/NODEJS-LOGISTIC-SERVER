module.exports = function (app) {
    var controller = require('./controllers/controller');
    var login = require('./controllers/login');
    var activity = require('./controllers/activity');
    var contact = require('./controllers/contact');
    var user = require('./controllers/user');
    var svController = require('./controllers/server-controller');

    // todoList Routes
    app.route('/crm/user_login').post(login.login);

    app.route('/server/add_user').post(svController.addUser);

    app.route('/crm/get_list_company').post(controller.getListCompany);

    app.route('/crm/get_detail_company').post(controller.getDetailCompany);

    app.route('/crm/get_list_quick_contact').post(contact.getListQuickContact);

    app.route('/crm/get_list_quick_company').post(controller.getListQuickCompany);

    app.route('/crm/get_list_quick_deal').post(controller.getListQuickDeal);

    app.route('/crm/get_list_activity').post(activity.getListActivity);

    app.route('/crm/get_list_contact').post(contact.getListContact);

    app.route('/crm/get_list_contact_full').post(contact.getListContactFull);

    app.route('/crm/update_activity').post(activity.updateActivity);

    app.route('/crm/get_list_meet_attend').post(activity.getListMeetAttend);

    app.route('/crm/get_list_user').post(user.getListUser);

    app.route('/crm/create_note').post(activity.createNote);

    app.route('/crm/get_note_associate').post(activity.getNoteAssociate);

    app.route('/crm/update_note_associate').post(activity.updateNoteAssociate);

    app.route('/crm/delete_note').post(activity.deleteNote);


};