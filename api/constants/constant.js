module.exports = {
    MESSAGE: {
        SYS_ERROR: "Lỗi xử lý hệ thống!",
        ACTION_FAIL: "Thao tác thất bại!",
        ACTION_SUCCESS: "Thao tác thành công!",
        LOGIN_SUCCESS: "Đăng nhập thành công!",
        DATA_NOT_FOUND: "Không tìm thấy dữ liệu!",
        LOGIN_FAIL: "Đăng nhập thất bại!",
        INVALID_COMPANY: "Công ty đã tồn tại!",
        NO_PERMISSION: "Bạn không có quyền thực hiện thao tác này!",
        INVALID_USER: "Tên đăng nhập đã tồn tại!",
    },

    USER_ROLE: {
        GUEST: 0,
        STAFF: 1,
        MANAGER: 2
    },

    STATUS: {
        SUCCESS: 1,
        FAIL: 0
    },

    ACTIVITY_TYPE: {
        ALL: 0,
        CALL: 1,
        EMAIL: 2,
        MEET: 3,
        NOTE: 4,
        TASK: 5
    },

    COMPANY_ROLE: {
        PARENT: 1,
        CHILD: 2
    },

    MAIL_RESPONSE_TYPE: {
        SEND: 1,
        OPEN: 2,
        CLICK_LINK: 3,
        INVALID: 4,
        UNSUBSCRIBE: 5
    }
}