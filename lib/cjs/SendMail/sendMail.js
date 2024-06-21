"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = require("fs");
const sendEmail = async ({ options, config }) => {
    let htmlContent = options.html || "";
    const isHtml = options.isHtml || false;
    if (isHtml) {
        const htmlFilePath = htmlContent;
        try {
            htmlContent = await fs_1.promises.readFile(htmlFilePath, "utf-8");
        }
        catch (error) {
            console.error("Error reading HTML file: ", error);
            console.log("Give the path wrt the root directory of the project. Like: src/emails/email.html");
            return error;
        }
    }
    const transporter = nodemailer_1.default.createTransport(config);
    try {
        let info = await transporter.sendMail({
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: htmlContent,
        });
        console.log("Message sent: %s", info.messageId);
        // Optionally, you can log more information about the sent message:
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        return {
            success: true,
            message: `Message sent: ${info.messageId}`,
            previewUrl: nodemailer_1.default.getTestMessageUrl(info),
        };
    }
    catch (error) {
        console.error("Error sending email: ", error);
        return error;
    }
};
exports.default = sendEmail;
