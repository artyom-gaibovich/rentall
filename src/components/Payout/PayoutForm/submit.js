// Redux Form
import { reset } from 'redux-form';

import { addPayout } from '../../../actions/Payout/addPayoutAction';

async function submit(values, dispatch) {
  const paymentType = values.methodId;
	// PayPal
  const payEmail = paymentType == 1 ? values.payEmail : values.email;
	// Stripe
  const firstname = paymentType == 2 ? values.firstname : null;
  const lastname = paymentType == 2 ? values.lastname : null;
  const accountNumber = paymentType == 2 ? values.accountNumber : null;
  const routingNumber = paymentType == 2 ? values.routingNumber : null;
  const ssn4Digits = paymentType == 2 ? values.ssn4Digits : null;
  const businessType = paymentType == 2 ? values.businessType : null;

  if (paymentType === 2 && !values.isTokenGenerated) { // Checking Stripe token generated or not
    return;
  }

  dispatch(addPayout(
		values.methodId,
		payEmail,
		values.address1,
		values.address2,
		values.city,
		values.state,
		values.country,
		values.zipcode,
		values.currency,
		firstname,
		lastname,
		accountNumber,
		routingNumber,
		ssn4Digits,
		businessType,
		values.userId,
		values.accountToken,
		values.personToken,
	),
	);
	// dispatch(reset('PayoutForm'));
}

export default submit;
