# Uncanny Mailer 

**Uncanny Mailer** is an npm package designed to simplify the process of sending emails using the Gmail service. The package supports sending multiple emails at a time and offers the ability to use HTML content for emails.

## Features

- **Send Multiple Emails**: Easily send emails to multiple recipients.
- **HTML Support**: Send rich HTML content as the body of your emails.
- **Gmail Service**: Currently supports Gmail service using app passwords for authentication.

## Installation

To install the Uncanny Mailer package, use npm:

```bash
npm install uncanny-mailer
```

## Usage

Here’s a basic example of how to use Uncanny Mailer:

```javascript
import uMailer from 'uncanny-mailer';

const demoMail = 'test/email/demo.html';
const mail = {
    options: {
        from: '"Company Name" <company-email@example.com>',
        to: ["recipient1@example.com", "recipient2@example.com"], // Can be a single string or an array of strings
        subject: "Hello from Company Name", // optional
        html: demoMail, // optional
        isHtml: true // optional, depending on this it will be parsed
    },
    config: {
        service: "Gmail",
        auth: {
            user: "", // your Gmail address
            pass: "", // app password, refer to the documentation below
        },
    },
};

uMailer(mail);
```

## Configuration

### `options` Object

- **from** (string): The sender's email address and name. For example: `"Company Name" <company-email@example.com>`.
- **to** (string or array of strings): A single recipient email address or a list of recipient email addresses. For example: `"recipient@example.com"` or `["recipient1@example.com", "recipient2@example.com"]`.
- **subject** (string, optional): The subject line of the email.
- **html** (string, optional): A string or The path to an HTML file to be used as the email body (also a string). If you are giving a HTML file path (file path wrt root of project) you have to provide `isHtml: true`.
- **isHtml** (boolean, optional): If `true`, the content of the `html` property will be parsed as HTML.

### `config` Object

- **service** (string): The email service to use. Currently, only "Gmail" is supported.
- **auth** (object):
  - **user** (string): Your Gmail email address.
  - **pass** (string): Your Gmail app password. [Learn how to generate an app password](https://support.google.com/accounts/answer/185833).

## Gmail App Password

To use this package, you need to generate an app password for your Gmail account. Follow these steps:

1. Go to your Google Account.
2. Select Security.
3. Under "Signing in to Google," select App Passwords.
4. You might need to sign in. If you don’t have this option, it might be because:
   - 2-Step Verification is not set up for your account.
   - 2-Step Verification is only set up for security keys.
   - Your account is through work, school, or another organization.
   - You turned on Advanced Protection.
5. At the bottom, choose Select app and choose the app you’re using.
6. Choose Select device and choose the device you’re using.
7. Select Generate.
8. Follow the instructions to enter the App Password. The App Password is the 16-character code in the yellow bar on your device.
9. Tap Done.

## Example

Here is a complete example of sending an email using the Uncanny Mailer package:

```javascript
import uMailer from 'uncanny-mailer';

const demoMail = 'test/email/demo.html';
const mail = {
    options: {
        from: '"Company Name" <company-email@example.com>',
        to: ["recipient1@example.com", "recipient2@example.com"], // Can be a single string or an array of strings
        subject: "Welcome to Company Name",
        html: demoMail,
        isHtml: true,
    },
    config: {
        service: "Gmail",
        auth: {
            user: "your-email@gmail.com",
            pass: "your-app-password",
        },
    },
};

uMailer(mail);
```

## Notes

- Ensure that the paths to the HTML files are correct.
- Handle any sensitive information such as email addresses and app passwords securely.
- The package currently supports only Gmail service.

## License

This package is open-source and available under the Apache-2.0 License.

## Contact

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/Uncanny-Devs/Mailer.git) or contact the maintainer.