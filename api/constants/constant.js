const MESSAGE = {
    SYS_ERROR: "Lỗi xử lý hệ thống!",
    ACTION_FAIL: "Thao tác thất bại!",
    ACTION_SUCCESS: "Thao tác thành công!",
    LOGIN_SUCCESS: "Đăng nhập thành công!",
    DATA_NOT_FOUND: "Không tìm thấy dữ liệu!",
    LOGIN_FAIL: "Đăng nhập thất bại!",
    INVALID_COMPANY: "Công ty đã tồn tại!",
}

const USER_ROLE = {
    GUEST: 0,
    STAFF: 1,
    MANAGER: 2
}
const STATUS = {
    SUCCESS: 1,
    FAIL: 0
}

const COMPANY_ROLE = {
    PARENT: 1,
    CHILD: 2
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
    ACTIVITY_TYPE: ACTIVITY_TYPE,
    COMPANY_ROLE: COMPANY_ROLE,
    USER_ROLE: USER_ROLE,
}