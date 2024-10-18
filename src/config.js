require('dotenv').config({
  path: '.env',
});

/* eslint-disable max-len */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || 'goodtrip.ru';
export const url = process.env.WEBSITE_URL || 'https://goodtrip.ru';
export const sitename = process.env.SITENAME;
export const adminEmail = process.env.ADMIN_EMAIL || 'gubanovas@mail.ru';

// Max File upload size in MB
export const maxUploadSize = 10;

// default locale is the first one
export const locales = ['ru', 'en-US', 'es', 'it-IT', 'fr-FR', 'pt-PT', 'ar'];

export const databaseUrl = process.env.DATABASE_URL;

// Listing Photos Upload Directory
export const fileuploadDir = process.env.FILEUPLOAD_DIR || './images/upload/';

// Logo upload directory
export const logouploadDir = process.env.LOGOUPLOAD_DIR || './images/logo/';

// Home page Banner upload directory
export const banneruploadDir = process.env.BANNER_UPLOAD_DIR || './images/banner/';

// User Profile Photos Upload Directory
export const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR || './images/avatar/';

// Document Upload
export const documentuploadDir = process.env.FILEUPLOAD_DIR || './images/document/';

// Location upload directory
export const locationuploadDir = process.env.LOGOUPLOAD_DIR || './images/popularLocation/';

// Static block image upload directory
export const homebanneruploadDir = process.env.HOME_BANNER_UPLOAD_DIR || './images/home/';

// Amenities upload directory
export const amenitiesUploadDir = process.env.AMENITIES_UPLOAD_DIR || './images/amenities/';

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID || 'G-HFVYFBK8VC',
  },

};
// process.env.GOOGLE_MAP_API || 'AIzaSyCwJbBcuhXezAIb1V8MsfG-5ueGPWa-nwI'
// Nikita Api-key AIzaSyBkxFb_cYYBa0i3l9-FdaumJFR2b15fStQ
export const googleMapAPI = 'AIzaSyBEVZOEk1PBcrUur4kpY7DGNqZmIQrbnyI';
export const googleMapServerAPI = process.env.GOOGLE_MAP_SERVER_API;
export const yandexMapServerAPI = process.env.YANDEX_MAP_SERVER_API;

export const serverKey = process.env.PUSH_NOTIFICATION_SERVER_KEY;

export const payment = {
  yookassa: {
    shop_id: process.env.YOOKASSA_SHOP_ID,
    secret_key: process.env.YOOKASSA_SECRET_KEY,
  },

  paypal: {
    email: process.env.PAYPAL_APP_EMAIL,
    clientId: process.env.PAYPAL_APP_CLIENT_ID,
    secret: process.env.PAYPAL_APP_SECRET,
    host: process.env.PAYPAL_HOST,
    hostMode: process.env.PAYPAL_MODE, // sandbox or live
    returnURL: `${url}${process.env.PAYPAL_RETURN_URL}`,
    cancelURL: `${url}${process.env.PAYPAL_CANCEL_URL}`,
    redirectURL: {
      success: `${url}${process.env.PAYPAL_SUCCESS_REDIRECT_URL}`,
      cancel: `${url}${process.env.PAYPAL_CANCEL_URL}`,
    },
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET, /* From ENV */
    publishableKey: 'pk_test_C5ukBJM7qr5P1F8dY4XKhdyp',
  },

};

// site key for google recaptcha
export const googleCaptcha = {
  sitekey: '6LeUn2IhAAAAAFcLoXLK_dYlcgD4BcFa9MMSSpLo',
};

// SMS verification
export const sms = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNTSID,
    authToken: process.env.TWILIO_AUTHTOKEN,
    phoneNumber: process.env.TWILIO_PHONENUMBER,
  },
};

// Email Settings
// export const emailConfig = {
//   host: process.env.SMTP_HOST, /* From ENV */
//   port: process.env.SMTP_PORT || 587,
//   email: process.env.SMTP_LOGIN_EMAIL || 'apikey',
//   sender: process.env.SMTP_FROM_NAME || 'RentALL',
//   senderEmail: process.env.SMTP_SENDER_EMAIL || 'm.yakimovich@tdirect.ru',
//   password: process.env.SMTP_LOGIN_PASSWORD, /* FROM ENV */
//   secure: process.env.SMTP_SECURE || true,
//   tls: process.env.SMTP_TLS || true,
// };

export const emailConfig = {
  host: 'goodtrip.ru',
  port: 587,
  email: 'support@tdirect.hopto.org:3000',
  sender: 'Goodtrip',
  senderEmail: 'support@goodtrip.ru',
  pass: 'qDrYhTX9VVDFLRB0',
  secure: false,
  tls: false,
};
export const auth = {

  jwt: { secret: process.env.JWT_SECRET },

  redirectURL: {
    login: process.env.LOGIN_URL || '/user/edit',
    verification: process.env.LOGIN_URL || '/user/verification',
    userbanned: process.env.USER_BANNED_URL || '/userbanned',
    returnURLDeletedUser: process.env.DELETE_USER_URL || '/userbanned',
  },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_APP_SECRET,
    returnURL: process.env.FACEBOOK_CLIENT_URL || `${url}/login/facebook/return`,
  },

  yandex: {
    id: process.env.YANDEX_APP_ID,
    secret: process.env.YANDEX_APP_SECRET,
    returnURL: process.env.YANDEX_CLIENT_URL || `${url}/login/yandex/callback`,
  },

  // https://dev.vk.com/
  vk: {
    id: process.env.VK_APP_ID,
    secret: process.env.VK_APP_SECRET,
    returnURL: process.env.VK_CLIENT_URL || `${url}/login/vk/return`,
  },

  // https://apiok.ru/
  odnoklassniki: {
    id: process.env.ODNOKLASSNIKI_APP_ID,
    secret: process.env.ODNOKLASSNIKI_APP_SECRET,
    pub: process.env.ODNOKLASSNIKI_APP_PUBLIC,
    returnURL: process.env.ODNOKLASSNIKI_CLIENT_URL || `${url}/login/odnoklassniki/return`,
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
    returnURL: process.env.GOOGLE_CLIENT_URL || `${url}/login/google/return`,
  },
};
