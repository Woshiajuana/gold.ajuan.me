
'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');

module.exports = {

    /**
     * @param {Number} len 长度
     * @return {String}
     * */
    randomNumber (len) {
        let result = '';
        while (len > 0) {
            len--;
            result += Math.floor(Math.random() * 10);
        }
        return result
    },

    /**
     * 同步创建目录
     * @param dir [String]
     * */
    mkdirSync (dir) {
        let loop;
        ;(loop = (dir, cb) => {
            if (!fs.existsSync(dir)) {
                loop(path.dirname(dir), () => {
                    fs.mkdirSync(dir);
                });
            }
            cb && cb();
        })(dir);
    },

    /**
     * 异步创建目录
     * @param dir [String]
     * */
    mkdir (dir) {
        let promise = Promise.resolve('本身有就');
        if (fs.existsSync(dir)) {
            return promise;
        }
        let loop = (dir) => new Promise((resolve, reject) => {
            if (fs.existsSync(dir)) {
                resolve()
            } else {
                util.promisify(fs.mkdir)(dir).then(resolve).catch(reject)
            }
        });
        let base = dir;
        let chain = [];
        while (base) {
            chain.unshift(loop.bind(this, dir));
            let objParse = path.parse(dir);
            base = objParse.base;
            dir = objParse.dir;
        }
        while (chain.length) {
            promise = promise.then(chain.shift());
        }
        return promise;
    }

};
