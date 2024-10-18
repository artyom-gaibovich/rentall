import {
  SET_USER_DATA_START,
  SET_USER_DATA_SUCCESS,
  SET_USER_DATA_ERROR,
} from '../constants';

// Redirection
import history from '../core/history';
import { decode } from '../helpers/queryEncryption';

const query = `
  query userAccount{
    userAccount {
      userId
      profileId
      firstName
      lastName
      displayName
      gender
      dateOfBirth
      email
      userBanStatus,   
      phoneNumber
      expiresYookassaToken
      preferredLanguage
      preferredCurrency
      location
      info
      createdAt
      picture
      country
      countryCode
      countryName
      verification {
        id
        isEmailConfirmed
        isFacebookConnected
        isVkConnected
        isOdnoklassnikiConnected
        isYandexConnected
        isGoogleConnected
        isIdVerification
        isPhoneVerified
      }
      userData {
        type
      }
    }
  }
`;
export function loadAccount(loginScreen, refer) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch({
      type: SET_USER_DATA_START,
    });
    try {
      const { data } = await graphqlRequest(query);

      if (data && data.userAccount) {
        const dateOfBirth = data.userAccount.dateOfBirth;
        let updatedProfileData;
        // console.log('USERDATA LOADING', data)
        if (dateOfBirth != null) {
          const dateOfBirthArray = dateOfBirth.split('-');
          const dateOfBirthObj = {
            month: Number(dateOfBirthArray[0] - 1),
            year: dateOfBirthArray[1],
            day: dateOfBirthArray[2],
          };
          const decodedObj = {
            email: decode(data.userAccount.email),
            phoneNumber: decode(data.userAccount.phoneNumber),
          };
          updatedProfileData = Object.assign({}, data.userAccount, dateOfBirthObj, decodedObj);
        } else {
          const decodedObj = {
            email: decode(data && data.userAccount && data.userAccount.email),
            phoneNumber: decode(data && data.userAccount && data.userAccount.phoneNumber),
          };
          updatedProfileData = { ...data.userAccount, ...decodedObj };
        }
        // console.log('USERDATA UPDATED', updatedProfileData)

        dispatch({
          type: SET_USER_DATA_SUCCESS,
          updatedProfileData,
        });
        if (loginScreen) {
          if (refer) {
            history.push(refer);
          } else {
            history.push('/dashboard');
          }
        }
      }
    } catch (error) {
      dispatch({
        type: SET_USER_DATA_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }
    return true;
  };
}
