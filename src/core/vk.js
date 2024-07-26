import passport from 'passport';
import { Strategy as VkStrategy } from 'passport-vkontakte';
import { User, UserLogin, UserClaim, UserProfile, UserVerifiedInfo, EmailToken } from '../data/models';
import { auth as config } from '../config';
// Send Email
import { sendEmail } from './email/sendEmail';
// Upload profile image from yandex
import { downloadFile } from './download/download';
// Helper
import { capitalizeFirstLetter } from '../helpers/capitalizeFirstLetter';

passport.use(
    new VkStrategy(
        {
            clientID: config.vk.id,
            clientSecret: config.vk.secret,
            callbackURL: config.vk.returnURL,
            passReqToCallback: true,
            scope: ['email'],
            profileFields: ['email', 'bdate'],
            lang: 'ru',
        },
        (req, accessToken, refreshToken, params, profile, done) => {
            /* eslint-disable no-underscore-dangle */
            const loginName = 'vk';
            const claimType = 'urn:vk:access_token';
            const vkLogin = async () => {
                if (req.user) {
                    // For Yandex verfication
                    await UserVerifiedInfo.update(
                        {
                            isVkConnected: true,
                        },
                        {
                            where: { userId: req.user.id },
                        }
                    );
                    done(null, {
                        type: 'verification',
                    });
                } else {
                    const email = profile && profile.emails && profile.emails.length && profile.emails[0].value ? profile.emails[0].value : `anonymus_vk_email_${Date.now()}@${Date.now()}.email`;
                    // Check if the email is already available
                    const userLogin = await User.findOne({
                        attributes: ['email', 'id', 'userBanStatus', 'userDeletedAt'],
                        where: { email: email, userDeletedAt: null },
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
                                    isVkConnected: true,
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
                        const dateOfBirth = profile._json.bdate ? profile._json.bdate.split('.') : null;
                        const firstName = capitalizeFirstLetter(profile._json.first_name);
                        const lastName = capitalizeFirstLetter(profile._json.last_name);
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
                                    dateOfBirth: dateOfBirth
                                        ? `${dateOfBirth[1]}-${dateOfBirth[2]}-${dateOfBirth[0]}`
                                        : null,
                                    gender: profile.gender ? capitalizeFirstLetter(profile.gender) : null,
                                    picture: null,
                                },
                                userVerifiedInfo: {
                                    isVkConnected: true,
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
                            name: profile._json.first_name,
                            email: email,
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
            vkLogin().catch(done);
        }
    )
);

export default passport;
