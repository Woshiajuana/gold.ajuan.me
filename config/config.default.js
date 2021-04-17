/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

module.exports = appInfo => {

    const config = exports = {};

    config.ossBasePath = path.join(__dirname, '../oss/') ;

    // 端口
    config.cluster = {
        listen: {
            path: '',
            port: 9999,
            hostname: '0.0.0.0',
        }
    };

    // 大小限制
    exports.bodyParser = {
        jsonLimit: '20mb',
        formLimit: '20mb',
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1557904782826_8085';

    // add your middleware config here
    config.middleware = [];

    // add cors
    config.cors = {
        origin: '*', // 访问白名单,根据你自己的需要进行设置
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    };

    // add security
    config.security = {
        csrf: {
            enable: false,
        },
    };

    // add validate
    config.validate = {
        client: {
            regular: {},
        },
    };

    // add response
    config.response = {

    };

    // 文件
    config.multipart = {
        fileSize: '20mb',
        mode: 'file',
        fileExtensions: [
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.xls',
            '.xlsx',
            '.txt',
            '.7z',
            '.rar',
            '.zip',

            '.apk',
            '.js',
            '.crx',

            /* 公钥私钥文件格式*/
            '.cer',
            '.crt',
            '.key',
            '.csr',
            '.der',
            '.store',
            '.pfx',
            '.pem',
            '.p12',
            '.properties',
            '.json',
            '.crl',
            '.jks',
            '.csv',
        ],
    };

    // add log
    config.logger = {
        level: 'INFO',
        dir: path.join(__dirname, '../logs/') // 保存路径为工程路径下`logs/prod/app`
    };

    return config;
};
