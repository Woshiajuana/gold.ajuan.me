'use strict';

const validator = require('validator');

function nonempty(value) {
    return typeof value !== 'undefined' && value !== '' && value !== null && !Number.isNaN(value);
}

function isObjectId (value) {
    return /^[0-9a-fA-F]{24}$/.test(value);
}

function forEach (obj, callback) {
    if (Array.isArray(obj)) return obj.forEach(callback);
    for (let key in obj) {
        callback && callback(obj[key], key);
    }
}

/**
 * 规则类
 * [
 *  'nonempty',
 *  'isEmail',
 *  { rule: 'nonempty', prompt: 'xxx' },
 *  { rule: 'isEmail', prompt: 'xxx' },
 *  { rule: /\d+/, prompt: 'xxx' },
 *  { rule: (v, source) => {}, prompt: 'xxx' },
 *  { rule: (v, source) => {}, prompt: 'xxx', must: true },
 *  { trim: true },
 *  { default: '123' },
 *  { transform: (v) => +v },
 * ]
 * 验证类
 * */
class Validate {

    constructor(app, config) {
        this.config = config;
        this.regular = Object.assign({ nonempty, isObjectId, }, validator, this.config.regular);
    }

    // 验证
    async check (source, expect, config = {}) {
        const { mode, errPrompt, trim } = Object.assign({}, this.config, config);

        // 判断期望值的类型
        if (typeof expect === 'function') {
            expect = await expect(this.regular);
        }

        // 初始化结果
        const sucResult = Array.isArray(expect) ? [] : {};
        const errResult = [];

        // 开始执行
        try {

            let isValidate = true;
            forEach(expect, (uses, key) => {

                // 获取到的值
                let value = source[key];

                // 校验没有，并且值并不是 undefined 就直接赋值返回
                if (!uses || !uses.length) {
                    if (value !== undefined) {
                        sucResult[key] = (trim && typeof value === 'string') ? value.trim() : value;
                    }
                    return null;
                }

                // 校验
                let isTrim;
                uses.forEach((use) => {
                    let useType = Object.prototype.toString.call(use);
                    let ruleFn, prompt, defValue, transform, must;

                    // 如果是对象
                    if (useType === '[object Object]') {
                        prompt = use.prompt; // tip
                        must = use.must; // 是否必须执行
                        defValue = use.default; // 默认值
                        if (!isTrim && use.trim !== undefined) {
                            isTrim = use.trim;
                        }
                        isTrim = use.trim; // 去除两边空格
                        transform = use.transform; // 转类型
                        use = use.rule; // 规则
                        useType = Object.prototype.toString.call(use);
                    }

                    // 判断是否赋值默认值
                    if (defValue !== undefined && value === undefined) {
                        value = defValue;
                    }

                    // 判断是否执行 trim
                    if (isTrim !== undefined && isTrim && typeof value === 'string') {
                        value = value.trim();
                    }

                    // 判断是否转类型
                    if (value !== undefined && typeof transform === 'function') {
                        value = transform(value);
                    }

                    // 判断规则
                    if (useType === '[object RegExp]') {
                        ruleFn = use.test;
                    } else if (useType === '[object String]') {
                        ruleFn = this.regular[use];
                    } else if (useType === '[object Function]') {
                        ruleFn = use;
                    }

                    // 校验
                    // 判断如果是不能为空的校验 或者 value 值不能为 undefined
                    if (ruleFn && (must || use === 'nonempty' || value !== undefined)) {
                        if (!ruleFn(value, source)) {
                            errResult.push(`${prompt || errPrompt[use] || errPrompt.common}:${key}`);
                            if (mode === 'one') throw new Error('参数错误');
                            isValidate = false;
                            return null;
                        }
                    }

                });

                // 赋值
                if (value !== undefined) {
                    // 全局判断是否去掉两边空格
                    if (typeof value === 'string' && isTrim === undefined && trim) {
                        value = value.trim();
                    }
                    // 赋值
                    sucResult[key] = value;
                }
            });
            if (!isValidate) throw new Error('参数错误');
            return Promise.resolve(sucResult);
        } catch (err) {
            err = errResult.length ? errResult.join(',') : typeof err === 'object' ? err.toString() : err;
            return Promise.reject(err);
        }
    }

}

function createClient(config, app) {
    return new Validate(app, config);
}

module.exports = app => {
    app.addSingleton('validate', createClient);
};

