
'use strict';

const { Service } = require('egg');
const images = require('images');
const ColorThief = require('colorthief');
const fs = require('fs');
const path = require('path');

module.exports = class TransFormService extends Service {

    // 获取图片信息
    async getImageFileInfo (filepath) {
        const image = images(filepath);
        return {
            width: image.width(),
            height: image.height(),
            size: fs.statSync(filepath).size,
            rgb: await ColorThief.getColor(filepath),
        };
    }

    // 写入文件
    async readWriteFile (filepath, output, filename) {
        const { ctx } = this;
        return new Promise(async (resolve, reject) => {
            // 创建读取流
            const rs = fs.createReadStream(filepath);
            await ctx.helper.mkdir(output);
            // 创建写入流
            const ws = fs.createWriteStream(path.join(output, filename));
            rs.pipe(ws);
            ws.on('finish', resolve);
        });
    }

};
