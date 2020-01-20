module.exports = function (app) {
    var controller = require('./controllers/controller');
    var login = require('./controllers/login');
    var activity = require('./controllers/activity');
    var contact = require('./controllers/contact');
    var comment = require('./controllers/comment');
    var user = require('./controllers/user');

    var call = require('./controllers/call');
    var note = require('./controllers/node');
    var meet = require('./controllers/meet');
    var email = require('./controllers/email');
    var task = require('./controllers/task');

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

    app.route('/crm/get_list_user').post(user.getListUser);


    app.route('/crm/create_meet').post(meet.createMeet);

    app.route('/crm/get_list_meet_attend').post(meet.getListMeetAttend);

    app.route('/crm/update_meet_attend').post(meet.updateMeetAttend);


    app.route('/crm/create_note').post(note.createNote);

    app.route('/crm/get_note_associate').post(note.getNoteAssociate);

    app.route('/crm/update_note_associate').post(note.updateNoteAssociate);

    app.route('/crm/delete_note').post(note.deleteNote);


    app.route('/crm/create_call').post(call.createCall);


    app.route('/crm/create_email').post(email.createEmail);


    app.route('/crm/add_comment').post(comment.addComment);

    app.route('/crm/edit_comment').post(comment.editComment);

    app.route('/crm/delete_comment').post(comment.deleteComment);


    app.route('/crm/create_task').post(task.createTask);


    app.route('/crm/add_contact').post(contact.addContact);

    app.route('/crm/add_contact_by_id').post(contact.addContactByID);

    app.route('/crm/search_contact').post(contact.searchContact);



};