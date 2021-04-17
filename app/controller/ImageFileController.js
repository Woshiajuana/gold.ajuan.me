
'use strict';

const { Controller } = require('egg');
const path = require('path');
const url = require('url');
const fs = require('fs');
const images = require('images');

module.exports = class HandleController extends Controller {

    static routes (app, middleware, controller) {
        return [
            { path: '/api/v1/image/upload', handlers: [ middleware.tryCatchMiddleware(), controller.upload ] },
            { method: 'get', path: '/*', handlers: [ middleware.tryCatchMiddleware(), controller.info ] },
        ]
    }

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/v1/image/upload  单文件上传文件
     * @apiGroup image 文件
     *
     * @apiParam  {String} output 输出目录
     * @apiParam  {String} [filename] 文件名称
     * @apiParam  {File} file 文件
     *
     * @apiSuccess (成功) {Object} data
     * @apiSampleRequest /api/v1/image/upload
     */
    async upload () {
        const { ctx, service, app } = this;
        let [
            file
        ] = await ctx.validateFiles([
            [ 'nonempty' ]
        ]);
        let {
            output,
            filename,
        } = await ctx.validateBody({
            output: [ 'nonempty' ],
            filename: [],
        });
        let {
            filename: name,
            filepath,
        } = file;
        if (!filename) {
            filename = name;
        }
        // 存储图片
        await service.imageFileService.readWriteFile(
            filepath,
            path.join(__dirname, '../../oss/', output),
            filename
        );
        // 图片信息
        let objInfo = await service.imageFileService.getImageFileInfo(filepath);
        ctx.respSuccess({
            ...objInfo,
            filename,
            name,
            filepath: path.join(output, filename),
            baseUrl: app.config.publicUrl,
            type: path.extname(filename).substring(1),
        });
    }

    /**
     * @apiVersion 1.0.0
     * @api {get} /*  获取图片文件
     * @apiGroup image 文件
     *
     * @apiParam  {String} w 宽度
     * @apiParam  {String} h 高度
     * @apiParam  {String} q 质量
     *
     * @apiSuccess (成功) {Object} data
     * @apiSampleRequest /*
     */
    async info () {
        const { ctx } = this;
        let {
            w,
            h,
            q,
        } = await ctx.validateQuery({
            w: [{ transform: (v) => +v }, { rule: (v) => !Number.isNaN(v) }],
            h: [{ transform: (v) => +v }, { rule: (v) => !Number.isNaN(v) }],
            q: [{ transform: (v) => +v }, { rule: (v) => !Number.isNaN(v), default: 60 }],
        });
        let pathname = decodeURIComponent(url.parse(ctx.request.url).pathname);
        let ext = path.extname(pathname).substring(1);
        let type = ext === 'png' ? 'png' : 'jpeg';
        let filepath = path.join(__dirname, '../../oss/', pathname);
        ctx.set('content-type', `image/${type}`);
        if (q >= 100) {
            return ctx.body = fs.createReadStream(filepath);
        }
        const image = images(filepath);
        if (w || h) {
            image.size(w, h);
        }
        // let { width, height } = image.size();
        // let s = Math.ceil(Math.min(width, height) / 4);
        // const wr = images(path.join(__dirname, '../watermark/daysnap.png')).size(s);
        // image.draw(wr, 0, 0);
        ctx.body = image.encode(type, { quality: q });
    }

};
