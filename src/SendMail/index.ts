import sendEmail from "./sendMail.js";
import configGenerator from "../config/nodemailer.config.js";
import { NodeMailerConfigDto } from "../config/nodemailerConfig.dto.js";
import { SendMailOptions as OriginalSendMailOptions } from "./sendMail.js";
import generateEmailHtml from "./htmlPreprocessor.js"; // Add this import
import { SendMailDto } from "./sendMail.dto.js"; // Add this import

// Extended interface with JSX capabilities
export interface SendMailOptions extends OriginalSendMailOptions {
    options: SendMailDto & {
        jsxPath?: string;
        cssPath?: string;
        attachmentsPath?: string;
    };
}

// Modified mailer function
export default async function mailer({ options, config }: SendMailOptions) {
    const nodemailerConfig: NodeMailerConfigDto = configGenerator(config);
    
    // Destructure JSX-specific options
    const { jsxPath, cssPath, attachmentsPath, ...emailOptions } = options;

    if (jsxPath) {
        const { html, attachments } = await generateEmailHtml(
            jsxPath,
            cssPath,
            attachmentsPath
        );

        return sendEmail({
            options: {
                ...emailOptions,
                html,
                attachments: [
                    ...(emailOptions.attachments || []),
                    ...(attachments || [])
                ]
            },
            config: nodemailerConfig
        });
    }

    // Original behavior for non-JSX emails
    return sendEmail({
        options: emailOptions,
        config: nodemailerConfig
    });
}