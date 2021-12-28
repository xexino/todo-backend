const nodeMailer = require("nodemailer")
// const { MAILGUN } = require("../config/MailGun")

// exports.transport = nodeMailer.createTransport({
//     service: 'Mailgun',
//     auth: {
//         user: MAILGUN.user,
//         pass: MAILGUN.pass
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// })
exports.transport = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "90b3c92c694923",
        pass: "fbf953f5506759"
    }
});