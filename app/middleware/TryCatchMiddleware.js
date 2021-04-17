
'use strict';

module.exports = () => {
    return async function (ctx, next) {
        // try {
            await next();
        // } catch (err) {
            // console.log(err);
            // ctx.respError(err);
        // }
    };
};
