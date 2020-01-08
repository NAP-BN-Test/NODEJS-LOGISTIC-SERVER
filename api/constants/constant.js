const MESSAGE = {
    SYS_ERROR: "Lỗi xử lý hệ thống!",
    ACTION_FAIL: "Thao tác thất bại!",
    ACTION_SUCCESS: "Thao tác thành công!",
    LOGIN_SUCCESS: "Đăng nhập thành công!",
    DATA_NOT_FOUND: "Không tìm thấy dữ liệu!"
}

const STATUS = {
    SUCCESS: 1,
    FAIL: 0
}

const ACTIVITY_TYPE = {
    ALL: 0,
    CALL: 1,
    EMAIL: 2,
    MEET: 3,
    NOTE: 4,
    TASK: 5
}

module.exports = {
    MESSAGE: MESSAGE,
    STATUS: STATUS,
    ACTIVITY_TYPE: ACTIVITY_TYPE
}