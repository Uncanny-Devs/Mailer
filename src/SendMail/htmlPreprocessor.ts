import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Attachment } from "nodemailer/lib/mailer/index.js";

// Helper function with improved error messages
const readFile = async (filePath: string): Promise<string> => {
    try {
        return await fs.promises.readFile(filePath, "utf-8");
    } catch (error) {
        throw new Error(`Failed to read file at ${filePath}: ${(error as Error).message}`);
    }
};

// File validation utility
const validateFileExtension = (filePath: string, allowedExtensions: string[]) => {
    const ext = path.extname(filePath).slice(1);
    if (!allowedExtensions.includes(ext)) {
        throw new Error(
            `Invalid file extension for ${path.basename(filePath)}. ` +
            `Allowed: ${allowedExtensions.join(", ")}`
        );
    }
};

// Enhanced attachment parser with structure validation
const parseAttachments = async (filePath: string): Promise<Attachment[]> => {
    try {
        validateFileExtension(filePath, ["json"]);
        const content = await readFile(filePath);
        const attachments = JSON.parse(content);
        
        if (!Array.isArray(attachments)) {
            throw new Error("Attachments file must contain an array of attachment objects");
        }

        return attachments.map((att, index) => {
            if (!att.path) {
                throw new Error(`Attachment at index ${index} is missing required 'path' property`);
            }
            
            return {
                filename: att.filename || path.basename(att.path),
                path: att.path,
                cid: att.cid || generateCid(att.path),
                contentType: att.contentType,
                encoding: att.encoding
            };
        });
    } catch (error) {
        throw new Error(`Failed to parse attachments: ${(error as Error).message}`);
    }
};

// CID generator for missing CIDs
const generateCid = (filePath: string): string => {
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const filename = path.basename(filePath, path.extname(filePath));
    return `${filename}-${uniqueId}@mailer`;
};

// Component loader with validation
const importJsxComponent = async <T extends object>(
    filePath: string
): Promise<React.ComponentType<T>> => {
    try {
        validateFileExtension(filePath, ["jsx", "tsx"]);
        const module = await import(filePath);
        
        if (!module.default) {
            throw new Error("Component file must have a default export");
        }

        if (typeof module.default !== "function") {
            throw new Error("Default export must be a React component");
        }

        return module.default as React.ComponentType<T>;
    } catch (error) {
        throw new Error(`Failed to import JSX component: ${(error as Error).message}`);
    }
};

// Main HTML generator function
export default async function generateEmailHtml(
    jsxFilePath: string,
    cssFilePath?: string,
    attachmentsFilePath?: string
): Promise<{ html: string; attachments?: Attachment[] }> {
    try {
        // Resolve and validate paths
        const absolutePaths = {
            jsx: path.resolve(process.cwd(), jsxFilePath),
            css: cssFilePath ? path.resolve(process.cwd(), cssFilePath) : null,
            attachments: attachmentsFilePath ? path.resolve(process.cwd(), attachmentsFilePath) : null
        };

        // Load and validate CSS
        let cssContent = "";
        if (absolutePaths.css) {
            validateFileExtension(absolutePaths.css, ["css"]);
            cssContent = await readFile(absolutePaths.css);
        }

        // Load React component
        const EmailTemplate = await importJsxComponent<{ attachments?: Record<string, string> }>(
            absolutePaths.jsx
        );

        // Process attachments
        let attachments: Attachment[] = [];
        if (absolutePaths.attachments) {
            attachments = await parseAttachments(absolutePaths.attachments);
        }

        // Generate missing CIDs and create mapping
        const cidMapping = attachments.reduce((acc, att) => {
            if (att.filename && att.cid) {
                acc[att.filename] = `cid:${att.cid}`;
            }
            return acc;
        }, {} as Record<string, string>);

        // Validate template references
        const renderedComponent = ReactDOMServer.renderToStaticMarkup(
            React.createElement(EmailTemplate, { attachments: cidMapping })
        );
        
        // Check for missing attachments
        const referencedFiles = [...renderedComponent.matchAll(/cid:([^\s"']+)/g)]
            .map(match => match[1].split('@')[0].replace(/-\w+$/, ''));
            
        referencedFiles.forEach(filename => {
            if (!attachments.some(att => att.filename === filename)) {
                throw new Error(`Missing attachment for referenced file: ${filename}`);
            }
        });

        // Build final HTML document
        const finalHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssContent}</style>
            </head>
            <body>
                ${renderedComponent}
            </body>
            </html>
        `.replace(/\s+/g, ' ').trim();

        return {
            html: finalHtml,
            attachments: attachments.length > 0 ? attachments : undefined
        };
    } catch (error) {
        throw new Error(`Email generation failed: ${(error as Error).message}`);
    }
}