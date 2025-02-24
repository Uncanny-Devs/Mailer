import fs from "fs";
import path from "path";
// Helper function for reading files
const readFile = async (filePath) => {
    try {
        return await fs.promises.readFile(filePath, "utf-8");
    }
    catch (error) {
        throw new Error(`Failed to read file at ${filePath}: ${error.message}`);
    }
};
// Validate file extension
const validateFileExtension = (filePath, allowedExtensions) => {
    const ext = path.extname(filePath).slice(1);
    if (!allowedExtensions.includes(ext)) {
        throw new Error(`Invalid file extension for ${path.basename(filePath)}. Allowed: ${allowedExtensions.join(", ")}`);
    }
};
// Parse attachments and generate CID mappings
const parseAttachments = async (filePath) => {
    try {
        validateFileExtension(filePath, ["json"]);
        const content = await readFile(filePath);
        const attachments = JSON.parse(content);
        if (!Array.isArray(attachments)) {
            throw new Error("Attachments file must contain an array of attachment objects");
        }
        const cidMap = {};
        const parsedAttachments = attachments.map((att, index) => {
            if (!att.path) {
                throw new Error(`Attachment at index ${index} is missing required 'path' property`);
            }
            const cid = att.cid || generateCid(att.path);
            const filename = att.filename || path.basename(att.path);
            cidMap[filename] = `cid:${cid}`;
            return {
                filename,
                path: att.path,
                cid,
                contentType: att.contentType,
                encoding: att.encoding,
            };
        });
        return { attachments: parsedAttachments, cidMap };
    }
    catch (error) {
        throw new Error(`Failed to parse attachments: ${error.message}`);
    }
};
// Generate a unique CID
const generateCid = (filePath) => {
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const filename = path.basename(filePath, path.extname(filePath));
    return `${filename}-${uniqueId}@mailer`;
};
// Main function to generate email HTML
export default async function generateEmailHtml(htmlFilePath, cssFilePath, attachmentsFilePath) {
    try {
        // Resolve absolute paths
        const absolutePaths = {
            html: path.resolve(process.cwd(), htmlFilePath),
            css: cssFilePath ? path.resolve(process.cwd(), cssFilePath) : null,
            attachments: attachmentsFilePath ? path.resolve(process.cwd(), attachmentsFilePath) : null,
        };
        // Read and validate HTML
        validateFileExtension(absolutePaths.html, ["html"]);
        let emailHtml = await readFile(absolutePaths.html);
        // Read and validate CSS
        let cssContent = "";
        if (absolutePaths.css) {
            validateFileExtension(absolutePaths.css, ["css"]);
            cssContent = await readFile(absolutePaths.css);
        }
        // Parse attachments and generate CID mappings
        let attachments = [];
        let cidMap = {};
        if (absolutePaths.attachments) {
            const result = await parseAttachments(absolutePaths.attachments);
            attachments = result.attachments;
            cidMap = result.cidMap;
        }
        // Replace image sources in HTML with CID links
        emailHtml = emailHtml.replace(/src=["']([^"']+)["']/g, (match, src) => {
            const filename = path.basename(src);
            if (cidMap[filename]) {
                return `src="${cidMap[filename]}"`;
            }
            return match;
        });
        // Wrap the email content with the CSS
        const finalHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssContent}</style>
            </head>
            <body>
                ${emailHtml}
            </body>
            </html>
        `
            .replace(/\s+/g, " ")
            .trim();
        return {
            html: finalHtml,
            attachments: attachments.length > 0 ? attachments : undefined,
        };
    }
    catch (error) {
        throw new Error(`Email generation failed: ${error.message}`);
    }
}
