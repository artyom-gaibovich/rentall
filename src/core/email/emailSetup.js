
import { emailConfig } from '../../config';
import { getUserEmail } from './helpers/getUserEmail';

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// // create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport(smtpTransport({
//   host: emailConfig.host,
//   port: emailConfig.port,
//   auth: {
//     user: emailConfig.email,
//     pass: emailConfig.password,
//   },
//   tls: {
//         // do not fail on invalid certs
//     rejectUnauthorized: emailConfig.tls,
//   },
// }));
const transporter = nodemailer.createTransport({
  host: "goodtrip.ru",
  port: 587,
  auth: {
    user: "support@goodtrip.ru",
    pass: "qDrYhTX9VVDFLRB0",
  },
  tls: {
    rejectUnauthorized: false,
  },
});


const sendEmail = (app) => {
  app.post('/sendEmail', async (req, res, next) => {
    const mailOptions = req.body.mailOptions;
    const from = `${emailConfig.sender}<${emailConfig.senderEmail}>`;

    // console.log('emailConfig', from, emailConfig);

    if (mailOptions && mailOptions.to && mailOptions.to.indexOf('@') < 0) {
      mailOptions.to = await getUserEmail(mailOptions.to);
    }

    mailOptions.from = from; // Sender email(Platform/Admin)

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.send({ status: 400, response: error });
      }
      return res.send({ status: 200, response: 'email send successfully' });
    });
  });
};

export default sendEmail;
