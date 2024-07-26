import passport from 'passport';
import { Strategy as YandexStrategy } from 'passport-yandex';
import { User, UserLogin, UserClaim, UserProfile, UserVerifiedInfo, EmailToken } from '../data/models';
import { auth as config } from '../config';
// Send Email
import { sendEmail } from './email/sendEmail';
// Upload profile image from yandex
import { downloadFile } from './download/download';
// Helper
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';

passport.use(
    new YandexStrategy(
        {
            clientID: config.yandex.id,
            clientSecret: config.yandex.secret,
            callbackURL: config.yandex.returnURL,
            scope: ['login:birthday', 'login:info', 'login:avatar', 'login:email'],
            passReqToCallback: true,
        },
        (req, accessToken, refreshToken, profile, done) => {
            // console.log({req, accessToken, refreshToken, profile, done})
            
                // console.log('start try')
                /* eslint-disable no-underscore-dangle */
                const loginName = 'yandex';
                const claimType = 'urn:yandex:access_token';
                const yandexLogin = async () => {
                    if (req.user) {
                        // For Yandex verfication
                        await UserVerifiedInfo.update(
                            {
                                isYandexConnected: true,
                            },
                            {
                                where: { userId: req.user.id },
                            }
                        );
                        done(null, {
                            type: 'verification',
                        });
                    } else {
                        // Check if the email is already available
                        const userLogin = await User.findOne({
                            attributes: ['email', 'id', 'userBanStatus', 'userDeletedAt'],
                            where: { email: profile._json.default_email, userDeletedAt: null },
                        });
                        if (userLogin) {
                            if (userLogin.userBanStatus == 1) {
                                done(null, {
                                    id: userLogin.id,
                                    email: userLogin.email,
                                    type: 'userbanned',
                                });
                            } else if (userLogin.userDeletedAt != null) {
                                done(null, {
                                    id: userLogin.id,
                                    email: userLogin.email,
                                    type: 'userDeleted',
                                });
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
                                done(null, {
                                    id: userLogin.id,
                                    email: profile._json.default_email,
                                    type: 'login',
                                });
                            }
                        } else {
                            // docs - https://yandex.ru/dev/id/doc/dg/api-id/reference/response.html
                            const dateOfBirth = profile._json.birthday ? profile._json.birthday.split('-') : null;
                            const firstName = capitalizeFirstLetter(profile._json.first_name);
                            const lastName = capitalizeFirstLetter(profile._json.last_name);
                            const displayName = `${firstName} ${lastName}`;
                            const random = Date.now();
                            const user = await User.create(
                                {
                                    email: profile._json.default_email,
                                    emailConfirmed: true,
                                    password: User.generateHash(random.toString()),
                                    type: loginName,
                                    profile: {
                                        displayName,
                                        firstName,
                                        lastName,
                                        dateOfBirth: dateOfBirth
                                            ? `${dateOfBirth[1]}-${dateOfBirth[0]}-${dateOfBirth[2]}`
                                            : null,
                                        gender: profile._json.sex ? capitalizeFirstLetter(profile._json.sex) : null,
                                        picture: null,
                                    },
                                    userVerifiedInfo: {
                                        isYandexConnected: true,
                                    },
                                    emailToken: {
                                        token: random,
                                        email: profile._json.default_email,
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
                            // Send Email
                            const content = {
                                token: random,
                                name: profile._json.first_name,
                                email: profile._json.default_email,
                            };
                            sendEmail(profile._json.default_email, 'welcomeEmail', content);
                            done(null, {
                                id: user.id,
                                email: user.email,
                                type: 'login',
                            });
                        }
                    }
                };
                yandexLogin().catch(done);
           
        }
    )
);

export default passport;
