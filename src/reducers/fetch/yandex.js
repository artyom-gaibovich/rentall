import passport from '../passport';
import jwt from 'jsonwebtoken';
import { auth, url } from '../../config';

const yandexAuth = (app) => {
  app.get('/login/yandex', (req, res, next) => {
      // let referURL = req.query.refer;
        // if (referURL && referURL != null) {
        //     referURL = referURL.indexOf('---') >= 0 ? referURL.replace('---', '?') : referURL;
        //     referURL = referURL.indexOf('--') >= 0 ? referURL.replace('--', '&') : referURL;
        // }
        // if (referURL) {
        //     const expiresIn = 60 * 60; // 1 hour
        //     res.cookie('referURL', referURL, { maxAge: 1000 * expiresIn, httpOnly: true });
        // }
    passport.authenticate('yandex', {
      session: false,
    })(req, res, next);
  });

  app.get(
        '/login/yandex/return',
        passport.authenticate('yandex', {
          failureRedirect: '/login',
          session: false,
        }),
        (req, res) => {
            // console.log({req1: req })
                // console.log({res1: res })
                // console.log({auth1: auth })
          res.redirect('/');
            // try {

            //     const type = req.user.type;
            //     const referURL = req.cookies.referURL;
            //     if (referURL) {
            //         res.clearCookie('referURL');
            //         const expiresIn = 60 * 60 * 24 * 180; // 180 days
            //         const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
            //         res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
            //         res.redirect(referURL);
            //     } else if (type === 'verification') {
            //         res.redirect(auth.redirectURL.verification);
            //     } else if (type === 'userbanned') {
            //         res.redirect(auth.redirectURL.userbanned);
            //     } else if (type === 'userDeleted') {
            //         res.redirect(auth.redirectURL.returnURLDeletedUser);
            //     } else {
            //         const expiresIn = 60 * 60 * 24 * 180; // 180 days
            //         const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
            //         res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
            //         res.redirect(auth.redirectURL.login);
            //     }
            // } catch (error) {
            //     // console.log({error});
            //     throw new Error(error);
            // }
        },
    );
};

export default yandexAuth;
