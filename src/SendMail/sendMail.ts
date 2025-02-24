import nodemailer from "nodemailer";
import { SendMailDto } from "./sendMail.dto.js";
import { NodeMailerConfigDto } from "../config/nodemailerConfig.dto.js";
import { Attachment } from "nodemailer/lib/mailer/index.js";

export interface SendMailOptions {
    options: SendMailDto;
    config: NodeMailerConfigDto;
}

// Custom error class for better error handling
class EmailError extends Error {
    constructor(message: string, public details?: any) {
        super(message);
        this.name = "EmailError";
    }
}

const sendEmail = async ({ options, config }: SendMailOptions) => {
    // Validate required fields
    if (!options.html) {
        throw new EmailError("Email content is required. Provide either html or text.");
    }

    const transporter = nodemailer.createTransport(config);

    try {
        // Prepare the email payload
        const mailOptions: nodemailer.SendMailOptions = {
            from: options.from,
            to: options.to,
            cc: options.cc,
            bcc: options.bcc,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments,
            // // Add text alternative for non-HTML clients
            // text: options.text || stripHtml(options.html || "").result
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        
        // Logging improvements
        console.log(`Email sent to ${formatRecipients(options.to)}`);
        console.debug("Message ID:", info.messageId);
        console.debug("Preview URL:", nodemailer.getTestMessageUrl(info));

        return {
            success: true,
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info),
            accepted: info.accepted,
            rejected: info.rejected
        };
    } catch (error: any) {
        console.error("Email failed to send:");
        console.error("Recipients:", formatRecipients(options.to));
        console.error("Error details:", error.response || error.message);
        
        throw new EmailError("Failed to send email", {
            recipients: options.to,
            errorCode: error.code,
            smtpResponse: error.response
        });
    }
};

// Helper functions
function formatRecipients(recipients: string | string[]): string {
    return Array.isArray(recipients) ? recipients.join(", ") : recipients;
}

function stripHtml(html: string): { result: string } {
    // Simple HTML to text conversion (consider using a library like 'html-to-text' in production)
    return {
        result: html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    };
}

export default sendEmail;