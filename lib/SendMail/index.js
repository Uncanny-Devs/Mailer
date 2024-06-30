import sendEmail from "./sendMail.js";
import configGenerator from "../config/nodemailer.config.js";
export default async function mailer({ options, config }) {
    const nodemailerConfig = configGenerator(config);
    return sendEmail({ options, config: nodemailerConfig });
}
