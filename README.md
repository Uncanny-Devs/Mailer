# Uncanny Mailer

**Uncanny Mailer** is an advanced Node.js package designed to simplify the process of sending emails with rich HTML content, CSS styling, and attachments. It provides seamless integration with the Gmail service using app passwords for authentication.

## Features

- **Send Emails with HTML and CSS**: Use JSX-based email templates or static HTML with separate CSS files for rich email content.
- **Attachments Support**: Easily include images, PDFs, and other files as attachments.
- **Embedded Images via CID**: Use content IDs (CIDs) to embed images directly in the email.
- **Gmail Integration**: Send emails using Gmail's SMTP with app password authentication.

## Installation

Install the Uncanny Mailer package using npm:

```bash
npm install uncanny-mailer
```

## Usage

Here's an example demonstrating how to send an email with HTML, CSS, and attachments:

```javascript
import uMailer from 'uncanny-mailer';
import path from "path";

// Ensure we get the correct directory path (for ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mail = {
    options: {
        htmlPath: path.resolve(__dirname, "src/templates/email-template.html"),
		cssPath: path.resolve(__dirname, "src/templates/email-styles.css"),
        attachmentsPath: path.join(process.cwd(), "src/attachments.json"),
        from: '"Company Name" <company-email@example.com>',
        to: "recipient@example.com", // Single recipient or an array of emails
        subject: "Welcome to Our Service!",
    },
    config: {
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS, // App password
        },
    },
};

uMailer(mail).then(() => console.log("Email sent successfully!"))
    .catch(error => console.error("Failed to send email:", error));
```

## Configuration

### `options` Object

- **htmlPath** (string): Path to the HTML email template.
- **cssPath** (string, optional): Path to the CSS file to style the email.
- **attachmentsPath** (string, optional): Path to a JSON file containing attachments.
- **from** (string): The sender's email address and name (e.g., `"Company Name" <company-email@example.com>`).
- **to** (string or array): A single recipient or an array of recipients.
- **subject** (string, optional): The email subject line.

### `config` Object

- **service** (string): The email service provider (currently supports "gmail").
- **auth** (object):
  - **user** (string): Your Gmail email address.
  - **pass** (string): Your Gmail app password.

## Attachments JSON Format

To include attachments, define them in a JSON file (e.g., `attachments.json`):

```json
[
    {
        "filename": "header.jpg",
        "path": "./assets/header.jpg",
        "cid": "header-image"
    },
    {
        "filename": "document.pdf",
        "path": "./assets/document.pdf"
    }
]
```

- **filename**: Name of the file to be attached.
- **path**: Local file path.
- **cid** (optional): Content ID for embedding images inside the email.

## Generating Gmail App Password

To use this package, you need to generate an app password for your Gmail account:

1. Open your Google Account settings.
2. Navigate to **Security** > **Signing in to Google**.
3. Enable **2-Step Verification** if not already enabled.
4. Go to **App Passwords**.
5. Create a new app password for "Mail" and copy it.

Use this password as `EMAIL_PASS` in your environment variables.

## Example Email Template (HTML + CSS)

**HTML (`email-template.html`):**

```html
<div class="email-container">
    <header>
        <img src="cid:header-image" alt="Company Header" class="header-image" />
    </header>
    <main>
        <h1>Welcome to Our Service!</h1>
        <p>Here’s your important document:</p>
        <p><a href="#document" class="document-link">📄 Download PDF Guide</a></p>
        <p>Best regards,<br>The Team</p>
    </main>
</div>
```

**CSS (`email-styles.css`):**

```css
.email-container {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    background-color: #f7f7f7;
    padding: 20px;
}
.header-image {
    width: 100%;
    border-radius: 8px;
}
.document-link {
    color: #3498db;
    text-decoration: none;
    font-weight: bold;
}
```

## Notes

- Ensure the file paths for HTML, CSS, and attachments are correct.
- Do not hardcode email credentials; use environment variables.
- The package currently supports only Gmail SMTP.

## License

This package is open-source and available under the Apache-2.0 License.

## Contact

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/Uncanny-Devs/Mailer.git) or contact the maintainer.