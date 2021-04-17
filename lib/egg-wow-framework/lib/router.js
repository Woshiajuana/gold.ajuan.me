
'use strict';

/**
 *
 * Created by ajuan on 2020/08/03.
 *
 * 扩展了 router 的一些方法，方便 api 路由节点
 *
 * */

const fs = require('fs');
const path = require('path');
const cmdPath = process.cwd();

module.exports = app => {

    const { logger, config, router, ctx } = app;

    /**
     * 挂载的 api 路由节点，可用于路由节点入库
     * 用作用户 api 路由节点权限控制
     */
    router.routeNodes = [];

    /**
     * 路由挂载方法
     * @param routeNode {Object} 路由节点:
     *  routeNode {
     *     name: '', // 节点名称
     *     method: 'post', // 节点请求 [get, post, delete ...]
     *     isKeep: true, // 是否缓存到 router.wRoutes 中
     *     handlers: [], // 中间件、controller 等处理函数
     *  }
     * */
    router.mount = function (routeNode = {}) {
        const { routerExtend } = config;
        const {
            path,
            method,
            handlers,
            isKeep,
        } = Object.assign({}, routerExtend, routeNode);

        if (!path) {
            logger.w(`缺少请求路径：path`, routeNode);
            return null;
        }

        if (!handlers || !handlers.length) {
            logger.w(`缺少处理函数：handlers`, routeNode);
            return null;
        }

        if (isKeep) {
            this.routeNodes.push(routeNode);
        }
        // 挂载
        this[method.toLocaleLowerCase()](path, ...handlers);
    };

    /**
     * 根据目录整体挂载，会递归遍历整个目录
     * @param dirPath {String} 相对路径 默认 './app/controller'
     * */
    router.mountRouteNodes = function (dirPath = './app/controller') {
        dirPath = path.join(cmdPath, dirPath);

        /**
         * 递归遍历 controller
         * */
        let funLoop, arrFiles = [];
        (funLoop = (filePath) => {
            fs.readdirSync(filePath).forEach((filename) => {
                let file = path.join(filePath, filename);
                if (fs.statSync(file).isFile()) {
                    arrFiles.push({
                        filename,
                        filePath,
                        file,
                    });
                } else {
                    funLoop(file);
                }
            });
        }) (dirPath);

        /**
         * 挂载路由节点
         * */
        arrFiles
            .filter(({ filename }) => filename.endsWith('Controller.js') && !filename.startsWith('_'))
            .forEach(({ filename, filePath, file }) => {
                let { controller, middleware } = app;
                const module = require(file);
                if (!module.routes) {
                    return null;
                }
                filePath.replace(/\\/g, '/').split('\/').forEach(key => {
                    if (controller[key]) {
                        controller = controller[key];
                    }
                });
                controller = controller[filename.charAt(0).toLowerCase() + filename.slice(1, -3)];
                const routeNodes = module.routes(app, middleware, controller);
                if (routeNodes && routeNodes.length) {
                    routeNodes.forEach((item) => this.mount(item));
                }
            });
    };

    return router;

};
