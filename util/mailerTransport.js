const nodemailer = require("nodemailer");
require('dotenv').config()
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD_GMAIL,
    },
});
const mailOption = {
    from: 'bagiyo666@gmail.com',
    to: '',
    cc: '',
    subject: '',
    html: '',

}
module.exports = {
    transport,
    mailOption
}
