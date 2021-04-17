
'use strict';

const { Controller } = require('egg');

module.exports = class HandleController extends Controller {

    static routes (app, middleware, controller) {
        return [
            { method: 'get', path: '/', handlers: [ middleware.tryCatchMiddleware(), controller.home ] }
        ]
    }

    async home () {
        const { ctx } = this;
        ctx.redirect('/public/apidoc/index.html');
    }

};
