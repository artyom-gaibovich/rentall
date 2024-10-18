// Redux Form
import { SubmissionError } from 'redux-form';

// Fetch request
import fetch from '../../core/fetch';

// Language
import messages from '../../locale/messages';

// Redux
import { setRuntimeVariable } from '../../actions/runtime';
import { loadAccount } from '../../actions/account';
import { closeSignupModal } from '../../actions/modalActions';

// Helper
import PopulateData from '../../helpers/populateData';

async function submit(values, dispatch) {
  values.firstName = values.firstName.trim();
  values.lastName = values.lastName.trim();
  console.log({values});
  values.phoneNumber = values.phoneNumber.replace('+7', '');
  const query = `query (
    $firstName:String,
    $lastName:String,
    $email: String!,
    $password: String!,
    $phoneNumber: String!
  ) {
      userRegister (
        firstName:$firstName,
        lastName:$lastName,
        email: $email,
        password: $password,
        phoneNumber: $phoneNumber
      ) {
        emailToken
        status
      }
    }`;

  const params = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
    phoneNumber: values.phoneNumber
  };

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: params,
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data.userRegister.status == 'success') {
    dispatch(closeSignupModal());
    const registerScreen = true;
    const refer = values.refer;
    dispatch(loadAccount(registerScreen, refer));
    dispatch(setRuntimeVariable({
      name: 'isAuthenticated',
      value: true,
    }));
  } else if (data.userRegister.status == 'email') {
    alert('Пользователь с таким email уже зарегистрирован')
    throw new SubmissionError({ _error: messages.emailAlreadyExists });
  } else if (data.userRegister.status == 'loggedIn') {
    dispatch(loadAccount());
    dispatch(setRuntimeVariable({
      name: 'isAuthenticated',
      value: true,
    }));
    throw new SubmissionError({ _error: messages.loggedIn });
  } else if (data.userRegister.status == 'adminLoggedIn') {
    throw new SubmissionError({ _error: messages.adminLoggedIn });
  } else {
    throw new SubmissionError({ _error: messages.somethingWentWrong });
  }
}

export default submit;
