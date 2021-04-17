'use strict';

module.exports = {
    async validate(source, expect, config) {
        return await this.app.validate.check(source, expect, config);
    },
    async validateHeader(expect, config) {
        this.logger.info(`请求参数[header] => `, JSON.stringify(this.request.header));
        return await this.app.validate.check(this.request.header, expect, config);
    },
    async validateBody(expect, config) {
        this.logger.info(`请求参数[body] => `, JSON.stringify(this.request.body));
        return await this.app.validate.check(this.request.body, expect, config);
    },
    async validateQuery(expect, config) {
        this.logger.info(`请求参数[query] => `, JSON.stringify(this.request.query));
        return await this.app.validate.check(this.request.query, expect, config);
    },
    async validateFiles(expect, config) {
        this.logger.info(`请求参数[files] => `, this.request.files);
        return await this.app.validate.check(this.request.files || [], expect, config);
    },
};
