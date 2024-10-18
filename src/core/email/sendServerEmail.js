import React from 'react';
import Oy from 'oy-vey';

import { emailConfig } from '../../config';

import EmailTemplate from './template/EmailTemplate';
import { getSubject } from './template/subjects';

// Helpers
import { getSiteLogo } from './helpers/getSiteLogo';
import { getUserEmail } from './helpers/getUserEmail';

// SMTP libraries & configurations
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

export async function sendServerEmail(to, type, content) {
  let html,
    subject,
    previewText,
    emailStatus = 200,
    emailErrorMessage = null;

  try {
    const subjectData = getSubject(type);
    const from = `${emailConfig.sender}<${emailConfig.senderEmail}>`;

    // console.log('emailConfig core', emailConfig);

    const emailContent = content;
    emailContent.logo = await getSiteLogo();
    // emailContent.logo = "email-logo.jpeg"
    // console.log(emailContent.logo)
    html = Oy.renderTemplate(<EmailTemplate type={type} content={emailContent} />, {
      title: subjectData && subjectData.subject,
      previewText: subjectData && subjectData.previewText,
    });

    const mailOptions = {
      from, // Sender
      to, // list of receivers
      subject: subjectData && subjectData.subject, // Subject line
      html,
    };

    if (to && to.indexOf('@') < 0) { // If sends userID of the receiver
      mailOptions.to = await getUserEmail(to);
    }

        // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(smtpTransport({
      host: 'goodtrip.ru',
      port: 587,
      auth: {
        user: 'support@goodtrip.ru',
        pass: 'qDrYhTX9VVDFLRB0',
      },
      tls: {
        rejectUnauthorized: false,
      },
    }));

    const sendSMTPEmail = await transporter.sendMail(mailOptions);
    if (sendSMTPEmail && !sendSMTPEmail.messageId) {
      emailStatus = 400;
      emailErrorMessage = 'Oops! Something went wrong. Unable to send the email.';
    }
  } catch (error) {
    emailStatus = 400;
    emailErrorMessage = `Oops! Something went wrong. ${error}`;
  }

  return await { emailStatus, emailErrorMessage };
}
