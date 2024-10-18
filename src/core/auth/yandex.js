import passport from '../passport';
import jwt from 'jsonwebtoken';
import { auth, url } from '../../config';
import axios from "axios";
import qs from "qs";
import { EmailToken, User, UserProfile, UserVerifiedInfo } from '../../data/models';
import { capitalizeFirstLetter } from '../../helpers/capitalizeFirstLetter';
import { sendEmail } from '../email/sendEmail';

const yandexAuth = (app) => {
    app.get('/login/yandex', (req, res, next) => {
        // // console.log({req, res})
       try {

            // let referURL = req.query.refer;
            // if (referURL && referURL != null) {
            //     referURL = referURL.indexOf('---') >= 0 ? referURL.replace('---', '?') : referURL;
            //     referURL = referURL.indexOf('--') >= 0 ? referURL.replace('--', '&') : referURL;
            // }
            // if (referURL) {
            //     const expiresIn = 60 * 60; // 1 hour
            //     res.cookie('referURL', referURL, { maxAge: 1000 * expiresIn, httpOnly: true });
            // }
            // passport.authenticate('yandex', {
            //     session: false,
            // })(req, res, next);
            // https://oauth.yandex.ru/authorize?response_type=code&redirect_uri=https%3A%2F%2Fgoodtrip.ru%2Flogin%2Fyandex%2Freturn&scope=login%3Abirthday%20login%3Ainfo%20login%3Aavatar%20login%3Aemail&client_id=03806d6443ee4dab9519ced0b62f6d40
            res.redirect(
                `https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.YANDEX_APP_ID}`
              );
       } catch (error) {
            // console.log({error});
            throw new Error(error);
       }
    });

    app.get(
        '/login/yandex/callback',
        // passport.authenticate('yandex', { failureRedirect: '/login' }),
       async (req, res) => {
            // console.log({myCode: req.query.code })
            const code = req.query.code;
           
            const token = await axios.post(
                  "https://oauth.yandex.ru/token",
                  qs.stringify({
                    grant_type: "authorization_code",
                    code: `${code}`,
                  }),
                  {
                    headers: {
                     'content-type': 'application/x-www-form-urlencoded',
                      Authorization: `Basic ${Buffer.from(
                        process.env.YANDEX_APP_ID +
                          ":" +
                          process.env.YANDEX_APP_SECRET,
                        "utf-8"
                      ).toString("base64")}`,
                    },
                  }
                )
            // console.log({yandexResponseData: token.data});

            const userInfo = await axios.get(
                `https://login.yandex.ru/info?format=json&jwt_secret=${process.env.JWT_SECRET}`,
                {
                  headers: {
                    Authorization: `OAuth ${token.data.access_token}`,
                  },
                }
              )
              
              // console.log({userInfo: userInfo.data});


              let userLogin = await User.findOne({
                attributes: ['email', 'id', 'userBanStatus', 'userDeletedAt'],
                where: { email: userInfo.data.default_email, userDeletedAt: null },
              });
              

            // console.log({userLogin});
                if (userLogin) {
                    userLogin = userLogin.dataValues;
                    
                    if (userLogin.userBanStatus == 1) {
                        res.redirect(auth.redirectURL.userbanned);
                    } else if (userLogin.userDeletedAt != null) {
                        res.redirect(auth.redirectURL.returnURLDeletedUser);
                    } else {
                        // There is an account associated with this email
                        await UserVerifiedInfo.update(
                            {
                                isYandexConnected: true,
                            },
                            {
                                where: { userId: userLogin.id },
                            }
                        );
                        const expiresIn = 60 * 60 * 24 * 180; // 180 days
                        const token = jwt.sign(userLogin, auth.jwt.secret, { expiresIn });
                        res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
                        res.redirect(auth.redirectURL.login);
                    }
                } else {
                    // docs - https://yandex.ru/dev/id/doc/dg/api-id/reference/response.html
                    const dateOfBirth = userInfo.data.birthday ? userInfo.data.birthday : null;
                    const firstName = capitalizeFirstLetter(userInfo.data.first_name);
                    const lastName = capitalizeFirstLetter(userInfo.data.last_name);
                    const displayName = `${firstName} ${lastName}`;
                    const random = Date.now();
                    let user = await User.create(
                        {
                            email: userInfo.data.default_email,
                            emailConfirmed: true,
                            password: User.generateHash(random.toString()),
                            type: 'yandex',
                            profile: {
                                displayName,
                                firstName,
                                lastName,
                                dateOfBirth: dateOfBirth
                                    ? `${dateOfBirth[1]}-${dateOfBirth[0]}-${dateOfBirth[2]}`
                                    : null,
                                phoneNumber: userInfo.data.default_phone ? userInfo.data.default_phone.number.replace('+7', '') : null,
                                gender: userInfo.data.sex ? capitalizeFirstLetter(userInfo.data.sex) : null,
                                picture: null,
                            },
                            userVerifiedInfo: {
                                isYandexConnected: true,
                            },
                            emailToken: {
                                token: random,
                                email: userInfo.data.default_email,
                            },
                        },
                        {
                            include: [
                                { model: UserProfile, as: 'profile' },
                                { model: UserVerifiedInfo, as: 'userVerifiedInfo' },
                                { model: EmailToken, as: 'emailToken' },
                            ],
                        }
                    );
                    user = user.dataValues;
                    // Send Email
                    const content = {
                        token: random,
                        name: userInfo.data.first_name,
                        email: userInfo.data.default_email,
                    };
                    // console.log({user})
                    sendEmail(userInfo.data.default_email, 'welcomeEmail', content);
                    const expiresIn = 60 * 60 * 24 * 180; // 180 days
                    const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
                    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
                    res.redirect(auth.redirectURL.login);
                }

                // // console.log({auth })
                // res.redirect('/');
                // const type = req.user.type;
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
                //         
                //     } else if (type === 'userDeleted') {
                //         
                //     } else {
                //         
                //     }
        }
    );
};

export default yandexAuth;
