// Redux Form
import { SubmissionError } from 'redux-form';

// Fetch request
import fetch from '../../core/fetch';

// Locale
import messages from '../../locale/messages';

// Redux Action
import { getListingDataStep3 } from '../../actions/getListingDataStep3';
import { manageListingSteps } from '../../actions/manageListingSteps';
import { setLoaderStart, setLoaderComplete } from '../../actions/loader/loader';

// For Redirect
import history from '../../core/history';
import { indexOf } from 'core-js/es6/array';

async function updateStep3(values, dispatch) {
  const weeklyDiscount = values.weeklyDiscount != '' ? values.weeklyDiscount : 0;
  const monthlyDiscount = values.monthlyDiscount != '' ? values.monthlyDiscount : 0;
  const cleaningPrice = values.cleaningPrice != '' ? values.cleaningPrice : 0;
  // let variables = Object.assign({}, values, { weeklyDiscount, monthlyDiscount, cleaningPrice });
  // console.log("updateStep3")
  // console.log(values)

  const id = values.id;
  let houseRules;
  if(values.houseRules[0].houseRulesId){
    houseRules = values.houseRules.map(item => typeof item == "object" ? Number(item.houseRulesId) : item)
    houseRules.filter((item,index) => houseRules.indexOf(item) == index)
  } else {
    houseRules = values.houseRules;
    houseRules.filter((item,index) => houseRules.indexOf(item) == index)
  }
  // console.log("houseRules")
  // console.log(houseRules)
  const fish = values.fish;
  const bookingNoticeTime = values.bookingNoticeTime;
  const checkInStart = values.checkInStart;
  const checkInEnd = values.checkInEnd;
  const maxDaysNotice = values.maxDaysNotice;
  const minNight = values.minNight;
  const maxNight = values.maxNight;
  const basePrice = values.basePrice;
  const currency = values.currency;
  const blockedDates = values.blockedDates;
  const bookingType = values.bookingType;
  const cancellationPolicy = values.cancellationPolicy;

  const variables = Object.assign({}, {
    weeklyDiscount,
    monthlyDiscount,
    cleaningPrice,
    id,
    houseRules,
    fish,
    bookingNoticeTime,
    checkInStart,
    checkInEnd,
    maxDaysNotice,
    minNight,
    maxNight,
    basePrice,
    currency,
    blockedDates,
    bookingType,
    cancellationPolicy,
  });


  dispatch(setLoaderStart('updateListing'));
  const query = `query (
  	$id: Int,
    $houseRules: [Int],
    $fish: [Int],
    $bookingNoticeTime:String,
    $checkInStart:String,
    $checkInEnd:String,
    $maxDaysNotice:String,
    $minNight:Int,
    $maxNight:Int,
    $basePrice:Float,
    $cleaningPrice:Float,
    $currency:String,
    $weeklyDiscount:Int,
    $monthlyDiscount:Int,
    $blockedDates: [String],
    $bookingType: String!,
    $cancellationPolicy: Int,
  ) {
      updateListingStep3 (
        id: $id,
        houseRules: $houseRules,
        fish: $fish,
        bookingNoticeTime:$bookingNoticeTime,
        checkInStart:$checkInStart,
        checkInEnd:$checkInEnd,
        maxDaysNotice:$maxDaysNotice,
        minNight:$minNight,
        maxNight:$maxNight,
        basePrice:$basePrice,
        cleaningPrice:$cleaningPrice,
        currency:$currency,
        weeklyDiscount:$weeklyDiscount,
        monthlyDiscount:$monthlyDiscount,
        blockedDates: $blockedDates,
        bookingType: $bookingType,
        cancellationPolicy: $cancellationPolicy
      ) {
        status
      }
    }`;

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();


  if (data && data.updateListingStep3 != undefined) {
    if (data.updateListingStep3.status == 'success') {
      await dispatch(getListingDataStep3(values.id));
      // await dispatch(manageListingSteps(values.id, 3));
      await dispatch(manageListingSteps(values.id, 3));

      await dispatch(setLoaderComplete('updateListing'));
      history.push(`/become-a-host/${values.id}/home`);
    } else if (data.updateListingStep3.status == 'notLoggedIn') {
      dispatch(setLoaderComplete('updateListing'));
      throw new SubmissionError({ _error: messages.notLoggedIn });
    } else {
      dispatch(setLoaderComplete('updateListing'));
      throw new SubmissionError({ _error: messages.somethingWentWrong });
    }
  } else {
    dispatch(setLoaderComplete('updateListing'));
    throw new SubmissionError({ _error: messages.somethingWentWrong });
  }
}

export default updateStep3;
