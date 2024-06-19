import nodemailer from "nodemailer";
import { SendMailDto } from "./sendMail.dto.js";
import { promises as fs } from "fs";
import { NodeMailerConfigDto } from "../config/nodemailerConfig.dto.js";

export interface SendMailOptions {
	options: SendMailDto;
	config: NodeMailerConfigDto;
}

const sendEmail = async ({ options, config }: SendMailOptions) => {
	let htmlContent: string = options.html || "";
	const isHtml: boolean = options.isHtml || false;

	if (isHtml) {
		const htmlFilePath: string = htmlContent;
		try {
			htmlContent = await fs.readFile(htmlFilePath, "utf-8");
		} catch (error: any) {
			console.error("Error reading HTML file: ", error);
			console.log(
				"Give the path wrt the root directory of the project. Like: src/emails/email.html"
			);
			return error;
		}
	}

	const transporter = nodemailer.createTransport(config);

	try {
		let info = await transporter.sendMail({
			from: options.from,
			to: options.to,
			subject: options.subject,
			html: htmlContent,
		});
		console.log("Message sent: %s", info.messageId);
		// Optionally, you can log more information about the sent message:
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

		return {
			success: true,
			message: `Message sent: ${info.messageId}`,
			previewUrl: nodemailer.getTestMessageUrl(info),
		};
	} catch (error: any) {
		console.error("Error sending email: ", error);
		return error;
	}
};

export default sendEmail;
