var moment = require('moment');

var arrCallStatus = [
    { id: 1, name: 'Không trả lời' },
    { id: 2, name: 'Bận' },
    { id: 3, name: 'Nhầm số' },
    { id: 4, name: 'Tin nhắn' },
    { id: 5, name: 'Cúp máy' },
    { id: 6, name: 'Đã kết nối' },
]

var arrTastType = [
    { id: 1, name: 'Cuộc gọi' },
    { id: 2, name: 'Email' },
    { id: 3, name: 'Gặp mặt' }
]

var arrMailStatus = [
    { id: 1, name: 'Đã gửi' },
    { id: 2, name: 'Đã nhận' },
    { id: 3, name: 'Đã trả lời' },
    { id: 4, name: 'Nhầm email' }
]

module.exports = {
    toDatetime: function (time) {
        if (time)
            return moment(time).format('DD/MM/YYYY HH:mm');
        else return null
    },

    callStatus: function (type) {
        var obj = arrCallStatus.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    mailStatus: function (type) {
        var obj = arrMailStatus.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    },

    taskType: function (type) {
        var obj = arrTastType.find(item => {
            return item.id == type
        });
        if (obj) {
            return obj.name
        } else return ''
    }
}