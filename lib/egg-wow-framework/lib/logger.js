
'use strict';

/**
 *
 * Created by ajuan on 2020/08/03.
 *
 * 扩展了 logger 的一些方法，方便 日志 调用生成
 *
 * */

module.exports = app => {

    const { logger, config } = app;

    const _formatMessage = (args) => Array.from(args).map(item => typeof item === 'object' ? JSON.stringify(item) : item);

    let {
        currentLevel,
        debugLev,
        infoLev,
        warnLev,
        errorLev,
        useConsole,
    } = config.loggerExtend;

    /**
     * 调试级别
     * */
    logger.d = function () {
        if (currentLevel >= debugLev) {
            if (useConsole) console.log(...arguments);
            logger.info(..._formatMessage(arguments));
        }
    };

    /**
     * 信息输出
     * */
    logger.i = function () {
        if (currentLevel >= infoLev) {
            if (useConsole) console.log(...arguments);
            logger.info(..._formatMessage(arguments));
        }
    };

    /**
     * 警告
     * */
    logger.w = function () {
        if (currentLevel >= warnLev) {
            if (useConsole) console.log(...arguments);
            logger.warn(..._formatMessage(arguments));
        }
    };

    /**
     * 错误
     * */
    logger.e = function () {
        if (currentLevel >= errorLev) {
            if (useConsole) console.log(...arguments);
            logger.error(..._formatMessage(arguments));
        }
    };

};
