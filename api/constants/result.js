const Constant = require('../constants/constant');

const ERROR_RESULT = {
    status: Constant.STATUS.FAIL,
    message: Constant.MESSAGE.ACTION_SUCCESS
}

const NO_DATA_RESULT = {
    status: Constant.STATUS.FAIL,
    message: Constant.MESSAGE.DATA_NOT_FOUND
}

const SYS_ERROR_RESULT = {
    status: Constant.STATUS.FAIL,
    message: Constant.MESSAGE.SYS_ERROR
}

const LOGIN_FAIL = {
    status: Constant.STATUS.FAIL,
    message: Constant.MESSAGE.LOGIN_FAIL
}

const ACTION_SUCCESS = {
    status: Constant.STATUS.SUCCESS,
    message: Constant.MESSAGE.ACTION_SUCCESS
}

module.exports = {
    ERROR_RESULT: ERROR_RESULT,
    NO_DATA_RESULT: NO_DATA_RESULT,
    SYS_ERROR_RESULT: SYS_ERROR_RESULT,
    LOGIN_FAIL: LOGIN_FAIL,
    ACTION_SUCCESS: ACTION_SUCCESS
}


