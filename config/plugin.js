'use strict';

const path = require('path');

// 跨域
exports.cors = {
    enable: true,
    package: 'egg-cors',
};

// 验证参数
exports.validate = {
    enable: true,
    // package: 'egg-wow-validate',
    path: path.join(__dirname, '../lib/egg-wow-validate')
};

// 响应
exports.response = {
    enable: true,
    // package: 'egg-wow-response',
    path: path.join(__dirname, '../lib/egg-wow-response')
};
