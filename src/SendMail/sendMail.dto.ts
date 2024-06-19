export interface SendMailDto{
    from: string;
    to: string | Array<string>;
    subject?: string;
    html?: string;
    isHtml?: boolean;
}