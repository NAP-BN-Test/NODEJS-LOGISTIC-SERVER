module.exports = function (app) {
    var company = require('./controllers/company');
    var login = require('./controllers/login');

    var activity = require('./controllers/activity');
    var activityContact = require('./controllers/activity-contact');

    var contact = require('./controllers/contact');
    var deal = require('./controllers/deal');
    var comment = require('./controllers/comment');
    var user = require('./controllers/user');

    var city = require('./controllers/city');

    var call = require('./controllers/call');
    var note = require('./controllers/note');
    var meet = require('./controllers/meet');
    var email = require('./controllers/email');
    var task = require('./controllers/task');

    var summary = require('./controllers/summary');

    var emailList = require('./controllers/emai-list');
    var report = require('./controllers/report');

    var emailEvent = require('./controllers/email-event');

    var upload = require('./controllers/upload');

    var amazon = require('./controllers/amazon');


    // todoList Routes
    app.route('/crm/user_login').post(login.login);

    app.route('/crm/add_user').post(user.addUser);

    //Company
    app.route('/crm/get_list_company').post(company.getListCompany);

    app.route('/crm/get_detail_company').post(company.getDetailCompany);

    app.route('/crm/get_list_quick_company').post(company.getListQuickCompany);

    app.route('/crm/update_company').post(company.updateCompany);

    app.route('/crm/search_company').post(company.searchCompany);

    app.route('/crm/add_company').post(company.addCompany);

    app.route('/crm/add_parent_company_by_id').post(company.addParentCompanyByID);

    app.route('/crm/add_child_company_by_id').post(company.addChildCompanyByID);

    app.route('/crm/assign_company_owner').post(company.assignCompany);

    app.route('/crm/follow_company').post(company.followCompany);

    app.route('/crm/delete_company').post(company.deleteCompany);

    app.route('/crm/delete_contact_from_company').post(company.deleteContactFromCompany);

    app.route('/crm/delete_company_from_company').post(company.deleteCompanyFromCompany);

    app.route('/crm/delete_deal_from_company').post(company.deleteDealFromCompany);

    app.route('/trailer/create_company').post(company.createCompanyTrailer);


    app.route('/crm/get_list_quick_deal').post(deal.getListQuickDeal);

    app.route('/crm/get_list_quick_deal_for_contact').post(deal.getListQuickDealForContact);

    app.route('/crm/get_deal_stage').post(deal.getDealStage);

    app.route('/crm/add_deal').post(deal.addDeal);

    app.route('/crm/update_deal').post(deal.updateDeal);


    app.route('/crm/get_list_activity').post(activity.getListActivity);

    app.route('/crm/update_activity').post(activity.updateActivity);

    app.route('/crm/get_list_activity_for_contact').post(activityContact.getListActivity);

    app.route('/crm/get_list_user').post(user.getListUser);

    //Meet
    app.route('/crm/create_meet').post(meet.createMeet);

    app.route('/crm/get_list_meet_attend').post(meet.getListMeetAttend);

    app.route('/crm/update_meet_attend').post(meet.updateMeetAttend);

    app.route('/crm/get_meet_associate').post(meet.getAssociate);

    app.route('/crm/update_meet_associate').post(meet.updateAssociate);

    app.route('/crm/get_list_meet').post(meet.getListMeet);

    app.route('/crm/delete_meet').post(meet.deleteMeet);


    //Note
    app.route('/crm/create_note').post(note.createNote);

    app.route('/crm/get_note_associate').post(note.getAssociate);

    app.route('/crm/update_note_associate').post(note.updateAssociate);

    app.route('/crm/delete_note').post(note.deleteNote);

    app.route('/crm/get_list_note').post(note.getListNote);


    //Call
    app.route('/crm/create_call').post(call.createCall);

    app.route('/crm/get_call_associate').post(call.getAssociate);

    app.route('/crm/update_call_associate').post(call.updateAssociate);

    app.route('/crm/get_list_call').post(call.getListCall);

    app.route('/crm/delete_call').post(call.deleteCall);


    //Email
    app.route('/crm/create_email').post(email.createEmail);

    app.route('/crm/get_email_associate').post(email.getAssociate);

    app.route('/crm/update_email_associate').post(email.updateAssociate);

    app.route('/crm/get_list_email').post(email.getListEmail);

    app.route('/crm/delete_email').post(email.deleteEmail);


    app.route('/crm/add_comment').post(comment.addComment);

    app.route('/crm/edit_comment').post(comment.editComment);

    app.route('/crm/delete_comment').post(comment.deleteComment);

    //Task
    app.route('/crm/create_task').post(task.createTask);

    app.route('/crm/get_task_associate').post(task.getAssociate);

    app.route('/crm/update_task_associate').post(task.updateAssociate);

    app.route('/crm/get_list_task').post(task.getListTask);

    app.route('/crm/update_task').post(task.updateTask);

    app.route('/crm/delete_task').post(task.deleteTask);

    //contact
    app.route('/crm/add_contact').post(contact.addContact);

    app.route('/crm/delete_contact').post(contact.deleteContact);

    app.route('/crm/add_contact_by_id').post(contact.addContactByID);

    app.route('/crm/search_contact').post(contact.searchContact);

    app.route('/crm/get_list_quick_contact').post(contact.getListQuickContact);

    app.route('/crm/get_detail_contact').post(contact.getDetailContact);

    app.route('/crm/get_list_contact').post(contact.getListContact);

    app.route('/crm/get_list_contact_full').post(contact.getListContactFull);

    app.route('/crm/update_contact').post(contact.updateContact);

    app.route('/crm/assign_contact_owner').post(contact.assignContact);

    app.route('/crm/follow_contact').post(contact.followContact);


    //summary
    app.route('/crm/get_summary_info').post(summary.getListActivity);

    //city
    app.route('/crm/get_list_city').post(city.getListCity);


    //Emai List
    app.route('/crm/get_mail_list').post(emailList.getMailList);

    app.route('/crm/get_mail_list_detail').post(emailList.getMailListDetail);

    app.route('/crm/get_list_mail_campain').post(emailList.getListMailCampain);

    app.route('/crm/add_mail_list').post(emailList.addMailList);

    app.route('/crm/add_mail_list_detail').post(emailList.addMailListDetail);

    app.route('/crm/add_mail_campain').post(emailList.addMailCampain);

    app.route('/crm/get_mail_list_option').post(emailList.getMailListOption);

    app.route('/crm/open_mail').get(emailList.addMailResponse);

    app.route('/crm/delete_mail_list').post(emailList.deleteMailList);

    app.route('/crm/delete_mail_list_detail').post(emailList.deleteMailListDetail);

    app.route('/crm/delete_mail_campain').post(emailList.deleteMailCampain);

    app.route('/crm/get_mail_campain_detail').post(emailList.getMailCampainDetail);

    app.route('/crm/send_mail_campain').post(emailList.sendMailCampain);

    app.route('/crm/update_mail_campain').post(emailList.updateMailCampain);


    //Report
    app.route('/crm/get_list_report_by_campain').post(report.getListReportByCampain);

    app.route('/crm/get_list_report_by_user').post(report.getListReportByUser);

    app.route('/crm/get_report_by_campain_summary').post(report.getReportByCampainSummary);

    app.route('/crm/get_report_by_campain_open_mail').post(report.getReportByCampainOpenMail);

    app.route('/crm/get_report_by_user_summary').post(report.getReportByUserSummary);

    app.route('/crm/get_report_by_user_mail_send').post(report.getReportByUserMailSend);



    //Upload file
    app.route('/crm/upload_file').post(upload.uploadFile);


    //Aws http
    app.route('/aws/mail_response').post(amazon.amazonResponse);

    app.route('/aws/verify_email').post(amazon.verifyEmail);

    app.route('/aws/send_email').post(amazon.sendEmail);


    //test
    app.route('/crm/test').get(emailEvent.test);
    app.route('/crm/test1').get(emailEvent.test1);



};