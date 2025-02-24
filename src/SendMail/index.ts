import sendEmail from "./sendMail.js";
import configGenerator from "../config/nodemailer.config.js";
import { NodeMailerConfigDto } from "../config/nodemailerConfig.dto.js";
import { SendMailOptions as OriginalSendMailOptions } from "./sendMail.js";
import generateEmailHtml from "./htmlPreprocessor.js"; // Add this import
import { SendMailDto } from "./sendMail.dto.js"; // Add this import

// Extended interface with html capabilities
export interface SendMailOptions extends OriginalSendMailOptions {
	options: SendMailDto & {
		htmlPath?: string;
		cssPath?: string;
		attachmentsPath?: string;
	};
}

// Modified mailer function
export default async function mailer({ options, config }: SendMailOptions) {
	const nodemailerConfig: NodeMailerConfigDto = configGenerator(config);

	// Destructure html-specific options
	const { htmlPath, cssPath, attachmentsPath, ...emailOptions } = options;

	if (htmlPath) {
		const { html, attachments } = await generateEmailHtml(
			htmlPath,
			cssPath,
			attachmentsPath
		);

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
