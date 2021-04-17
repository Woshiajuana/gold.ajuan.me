
'use strict';

const { Service } = require('egg');

module.exports = class CurlService extends Service {

    /**
     * 构造函数
     * @param ctx {Object} 上下文
     * @param options {Object}
     * */
    constructor (ctx, options = {}) {
        super(ctx);
        const { serviceExtend } = ctx.app.config;
        this.className = options.className || this.constructor.name;
        this.options = Object.assign({}, serviceExtend.options, serviceExtend[this.className] || {}, options);
    }

    /**
     * 请求拦截器
     * @param request {Object}
     * */
    async requestInterceptor (request) {
        return request;
    }

    /**
     * 响应拦截器
     * @param response {Object}
     * @param request {Object}
     * */
    async responseInterceptor (response, request) {
        return response;
    }

    /**
     * 请求日志，可以不使用
     * @param request {Object}
     * */
    requestLogger (request) {
        const { url, method, data } = request;
        this.log(`[${method}]调用服务:${url}`, `请求参数 => `, data);
    }

    /**
     * 响应日志，可以不使用
     * @param response {Object}
     * @param request {Object}
     * */
    responseLogger (response, request) {
        const { url, method } = request;
        const { status, data } = response;
        this.log(`[${method}]调用服务:${url}`, `请求结果[${status}] => `, data);
    }

    log () {
        const args = Array.from(arguments).map(item => typeof item === 'object' ? JSON.stringify(item) : item);
        this.logger.info(...args);
    }

    /**
     * 执行请求
     * @param url {String} url 请求地址
     * @param data {Object} 参数
     * @param options {Object} 配置参数
     * */
    async curl (url, data = {}, options = {}) {
        let request = Object.assign({}, this.options, { url, data }, options, );
        request = await this.requestInterceptor(request);
        if (!request) return null;
        url = request.url;
        if (!url.startsWith('http')) {
            url = request.url = `${request.baseUrl}${url}`;
        }
        this.requestLogger(request);
        const response = await this.ctx.curl(url, request);
        this.responseLogger(response, request);
        return this.responseInterceptor(response, request);
    }

};


