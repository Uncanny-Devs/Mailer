"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendMail_js_1 = __importDefault(require("./sendMail.js"));
const nodemailer_config_js_1 = __importDefault(require("../config/nodemailer.config.js"));
async function mailer({ options, config }) {
    const nodemailerConfig = (0, nodemailer_config_js_1.default)(config);
    return (0, sendMail_js_1.default)({ options, config: nodemailerConfig });
}
exports.default = mailer;
