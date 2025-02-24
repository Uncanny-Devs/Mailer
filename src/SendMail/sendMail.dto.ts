import { Attachment } from "nodemailer/lib/mailer/index.js";

export interface SendMailDto {
    // Core email fields
    from: string;
    to: string | Array<string>;
    cc?: string | Array<string>;
    bcc?: string | Array<string>;
    subject?: string;
    
    // HTML content options (mutually exclusive)
    html?: string;          // Direct HTML content or file path
    isHtml?: boolean;       // Flag for HTML file path
    
    // JSX template options
    jsxPath?: string;       // Path to JSX template component
    cssPath?: string;       // Optional CSS file path
    attachmentsPath?: string; // JSON file with attachment config
    
    // Attachments (can combine with generated ones)
    attachments?: Array<Attachment>;
}