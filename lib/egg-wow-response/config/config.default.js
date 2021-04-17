'use strict';

/**
 * egg-wow-response default config
 * @author Ajuan <979703986@qq.com>
 * @property {String} SOME_KEY - some description
 */
exports.response = {

    /**
     * 成功模板
     * */
    SUCCESS: {
        code: 'S00000',
        msg: '操作成功',
    },
    /**
     * 失败模板
     * */
    ERROR: {
        code: 'F99999',
        msg: '操作失败',
    },

    /**
     * 是否开启日志
     * */
    isLogger: true,

    /**
     * 成功回调参数格式化
     * */
    formatSuccess: ({ code, data, msg }) => ({ code, data, msg }),

    /**
     * 错误回调参数格式化
     * */
    formatError: ({ code, data, msg }) => ({ code, msg, data }),

    /**
     * 错误信息回调
     * */
    errorMsgHock: (data) => data.msg || data.message || JSON.stringify(data),
};
