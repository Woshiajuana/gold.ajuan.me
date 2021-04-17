/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = appInfo => {

    const config = exports = {

        /**
         * 日志扩展配置
         * */
        loggerExtend: {
            currentLevel: 4,
            debugLev: 4,
            infoLev: 3,
            warnLev: 2,
            errorLev: 1,
            useConsole: false,
        },

        /**
         * 路由扩展配置
         * */
        routerExtend: {
            method: 'post',
            isKeep: true,
        },

        /**
         * 服务扩展配置
         * */
        serviceExtend: {
            /**
             * 统一配置
             * */
            options: {
                method: 'POST',
                dataType: 'json',
                contentType: 'json',
                timeout: 30 * 1000,
            },
            DemoService: {
                name: '转发 DEMO 服务器示例',
                baseUrl: 'http://127.0.0.1:10002/',
            }
        },
    };

    return config;
};
