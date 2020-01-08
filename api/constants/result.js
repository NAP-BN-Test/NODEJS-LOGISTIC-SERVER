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

module.exports = {
    ERROR_RESULT: ERROR_RESULT,
    NO_DATA_RESULT: NO_DATA_RESULT,
    SYS_ERROR_RESULT: SYS_ERROR_RESULT,
}


