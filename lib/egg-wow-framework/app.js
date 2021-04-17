'use strict';

/**
 *
 * Created by ajuan on 2020/08/03.
 *
 * */

module.exports = app => {

    /**
     * 扩展日志
     * */
    require('./lib/logger')(app);

    /**
     * 扩展路由
     * */
    require('./lib/router')(app);

};
