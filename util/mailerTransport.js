const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "servicemailepn@gmail.com",
        pass: "hzqlunqavruthanb",
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
