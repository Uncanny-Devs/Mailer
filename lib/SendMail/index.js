import sendEmail from "./sendMail.js";
import configGenerator from "../config/nodemailer.config.js";
import generateEmailHtml from "./htmlPreprocessor.js"; // Add this import
// Modified mailer function
export default async function mailer({ options, config }) {
    const nodemailerConfig = configGenerator(config);
    // Destructure html-specific options
    const { htmlPath, cssPath, attachmentsPath, ...emailOptions } = options;
    if (htmlPath) {
        const { html, attachments } = await generateEmailHtml(htmlPath, cssPath, attachmentsPath);
        return sendEmail({
            options: {
                ...emailOptions,
                html,
                attachments: [
                    ...(emailOptions.attachments || []),
                    ...(attachments || []),
                ],
            },
            config: nodemailerConfig,
        });
    }
    // Original behavior for non-html emails
    return sendEmail({
        options: emailOptions,
        config: nodemailerConfig,
    });
}
