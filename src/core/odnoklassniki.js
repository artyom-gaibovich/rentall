import passport from 'passport';
import { Strategy as OdnoklassnikiStrategy } from 'passport-ok-strategy';
import { User, UserLogin, UserClaim, UserProfile, UserVerifiedInfo, EmailToken } from '../data/models';
import { auth as config } from '../config';
// Send Email
import { sendEmail } from './email/sendEmail';
// Upload profile image from yandex
import { downloadFile } from './download/download';
// Helper
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';

passport.use(
    new OdnoklassnikiStrategy(
        {
            clientID: config.odnoklassniki.id,
            clientPublic: config.odnoklassniki.pub,
            clientSecret: config.odnoklassniki.secret,
            callbackURL: config.odnoklassniki.returnURL,
            passReqToCallback: true,
            scope: ['GET_EMAIL', 'VALUABLE_ACCESS'],
            profileFields: ['email'],
        },
        (req, accessToken, refreshToken, profile, done) => {
            /* eslint-disable no-underscore-dangle */
            const loginName = 'odnoklassniki';
            const claimType = 'urn:odnoklassniki:access_token';
            const odnoklassnikiLogin = async () => {
                if (req.user) {
                    // For Yandex verfication
                    await UserVerifiedInfo.update(
                        {
                            isOdnoklassnikiConnected: true,
                        },
                        {
                            where: { userId: req.user.id },
                        }
                    );
                    done(null, {
                        type: 'verification',
                    });
                } else {
                    // console.log(profile);
                    const email = profile.emails[0];
                    // Check if the email is already available
                    const userLogin = await User.findOne({
                        attributes: ['email', 'id', 'userBanStatus', 'userDeletedAt'],
                        where: { email, userDeletedAt: null },
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
                                    isOdnoklassnikiConnected: true,
                                },
                                {
                                    where: { userId: userLogin.id },
                                }
                            );
                            done(null, {
                                id: userLogin.id,
                                email,
                                type: 'login',
                            });
                        }
                    } else {
                        const dateOfBirth = profile._json.bdate ? profile._json.bdate.split('-') : null;
                        const firstName = capitalizeFirstLetter(profile._json.name.givenName);
                        const lastName = capitalizeFirstLetter(profile._json.name.familyName);
                        const displayName = `${firstName} ${lastName}`;
                        const random = Date.now();
                        const user = await User.create(
                            {
                                email,
                                emailConfirmed: true,
                                password: User.generateHash(random.toString()),
                                type: loginName,
                                profile: {
                                    displayName,
                                    firstName,
                                    lastName,
                                    dateOfBirth: dateOfBirth ? `${dateOfBirth[1]}-${dateOfBirth[0]}-${dateOfBirth[2]}` : null,
                                    gender: profile._json.gender ? capitalizeFirstLetter(profile._json.gender) : null,
                                    picture: null,
                                },
                                userVerifiedInfo: {
                                    isOdnoklassnikiConnected: true,
                                },
                                emailToken: {
                                    token: random,
                                    email,
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
                            name: profile._json.name.givenName,
                            email,
                        };
                        sendEmail(email, 'welcomeEmail', content);
                        done(null, {
                            id: user.id,
                            email: user.email,
                            type: 'login',
                        });
                    }
                }
            };
            odnoklassnikiLogin().catch(done);
        }
    )
);

export default passport;
