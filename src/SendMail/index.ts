import sendEmail from "./sendMail.js";
import configGenerator from "../config/nodemailer.config.js";
import { NodeMailerConfigDto } from "../config/nodemailerConfig.dto.js";
import { SendMailOptions } from "./sendMail.js";


export default async function mailer({ options, config }: SendMailOptions) {
    const nodemailerConfig: NodeMailerConfigDto = configGenerator(config);
    return sendEmail({ options, config: nodemailerConfig });
}