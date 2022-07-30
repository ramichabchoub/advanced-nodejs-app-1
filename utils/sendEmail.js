import nodemailer from 'nodemailer'

// nodemailer
const sendEmail = async (options) => {
        // 1) create a transporter ( service that will send the email like gmail, yahoo, mailgun, mailtrap, sendgrid)
        // gmail send max 500 email/day
        const transporter = nodemailer.createTransport({
                host: process.env.MAIL_SERVER,
                port: process.env.MAIL_PORT, // if secure false, port 587 else 465
                secure: process.env.MAIL_USE_SSL,
                auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASS,
                },
        })
        // 2) Define email options (from, to, subject, html)
        const mailOptions = {
                from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
                to: options.email,
                subject: options.subject,
                text: options.message,
        };
        // 3) send the email
        return transporter.sendMail(mailOptions)
};

export default sendEmail;