'use strict';

module.exports = {

    /**
     * 成功回调
     * @param {Object|String} data 返回参数
     * @param {Object} template 返回模板 { code: 'S00000', msg: '操作成功' }
     * @param {Number} status http code
     * @param {Object} config 配置，可以修改返回结果
     * */
    respSuccess(data = null, template = '', status = 200, config = {}) {
        const {
            app,
            logger,
        } = this;
        const {
            SUCCESS,
            formatSuccess,
            isLogger,
        } = Object.assign({}, config, app.config.response);
        const {
            code,
            msg,
            status: httpCode = status
        } = Object.assign({}, SUCCESS, (template || {}));
        const result = formatSuccess({ data, code, msg });
        if (isLogger) {
            logger.info(`成功回调[${httpCode}] => `, JSON.stringify(result));
        }
        /**
         * 设置 http code
         * */
        this.status = httpCode;
        this.body = result;
    },

    /**
     * 失败回调
     * @param {Object|String} options 参数，可能是错误，也有可能是返回模板  { code: 'F99999', msg: '操作失败' }
     * @param {Number} status http code
     * @param {Object} config 配置
     * */
    respError(options, status = 200, config = {}) {
        let {
            app,
            logger,
        } = this;
        const {
            ERROR,
            formatError,
            errorMsgHock,
            isLogger,
        } = Object.assign({}, config, app.config.response);
        const stringOptions = Object.prototype.toString.apply(options);
        let {
            code,
            msg,
            data = null,
            status: httpCode = status
        } = Object.assign({}, ERROR, stringOptions === '[object Object]' ? options : {});
        if (typeof options !== 'undefined' && options !== '') {

            /**
             * 如果 options 不为 undefined，且不等于 ''
             * */
            if (stringOptions === '[object Object]') {
                /**
                 * 如果是对象
                 * */
                msg = errorMsgHock(options);
            } else if (stringOptions === '[object Array]') {
                /**
                 * 如果是数组
                 * */
                msg = JSON.stringify(options);
            } else if (stringOptions === '[object Error]') {
                /**
                 * 如果是错误
                 * */
                msg = options.toString();
            } else {
                msg = `${options}`;
            }
        }
        const result = formatError({ code, msg, data });
        if (isLogger) {
            logger.info(`失败回调[${httpCode}] => `, JSON.stringify(result));
        }
        /**
         * 设置 http code
         * */
        this.status = httpCode;
        this.body = result;
    },
};
