"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function configGenerator(config) {
    const nodemailerConfig = {
        service: config.service,
        auth: {
            user: config.auth.user,
            pass: config.auth.pass,
        },
    };
    return nodemailerConfig;
}
;
exports.default = configGenerator;
