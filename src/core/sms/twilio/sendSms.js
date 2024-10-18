import { sms, sitename } from '../../../config';
import twilio from 'twilio';

import { updateVerificationCode, getCountryCode } from './helpers/dbFunctions';

const client = new twilio(sms.twilio.accountSid, sms.twilio.authToken);

const TwilioSms = (app) => {
  app.post('/send-verification-code', async (req, res) => {
    let responseStatus = 200,
      errorMessage;
    const phoneNumber = req.body.phoneNumber;
    const dialCode = req.body.dialCode;
    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    let message = `${sitename} security code: ${verificationCode}`;
    message += '. Use this to finish verification.';
    const userId = req.user.id;


    const convertedNumber = dialCode + phoneNumber;

    try {
      await updateVerificationCode(verificationCode, userId);

      const responseData = await client.messages
                .create({
                  body: message,
                  from: sms.twilio.phoneNumber,
                  to: convertedNumber,
                });
    } catch (error) {
      responseStatus = 400;
      errorMessage = error.message;
    }


    res.send({ status: responseStatus, errorMessage });
  });
};

export default TwilioSms;
