import nodemailer from "nodemailer";
import { promises as fs } from "fs";
const sendEmail = async ({ options, config }) => {
    let htmlContent = options.html || "";
    const isHtml = options.isHtml || false;
    if (isHtml) {
        const htmlFilePath = htmlContent;
        try {
            htmlContent = await fs.readFile(htmlFilePath, "utf-8");
        }
        catch (error) {
            console.error("Error reading HTML file: ", error);
            console.log("Give the path wrt the root directory of the project. Like: src/emails/email.html");
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
    }
    catch (error) {
        console.error("Error sending email: ", error);
        return error;
    }
};
export default sendEmail;
