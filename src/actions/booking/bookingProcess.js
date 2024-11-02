import { gql } from 'react-apollo';
import moment from 'moment';

import history from '../../core/history';
import { makePayment } from './makePayment';

import { BOOKING_PROCESS_START, BOOKING_PROCESS_SUCCESS, BOOKING_PROCESS_ERROR } from '../../constants';

export function bookingProcess(listId, guests, startDate, endDate, preApprove, taxRate, paynow, prePayment, totalPayment) {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: BOOKING_PROCESS_START,
      payload: {
        bookingLoading: true,
      },
    });

    try {
      const query = gql`
                query UserListing($listId: String!) {
                    UserListing(listId: $listId) {
                        id
                        userId
                        title
                        coverPhoto
                        country
                        city
                        state
                        personCapacity
                        bookingType
                        listPhotos {
                            id
                            name
                        }
                        user {
                            id
                            email
                            profile {
                                profileId
                                displayName
                                firstName
                                picture
                            }
                        }
                        settingsData {
                            id
                            settingsId
                            listsettings {
                                id
                                itemName
                                settingsType {
                                    typeName
                                }
                            }
                        }
                        houseRules {
                            houseRulesId
                            listsettings {
                                itemName
                                isEnable
                                settingsType {
                                    typeName
                                }
                            }
                        }
                        fish {
                            fishId
                            listsettings {
                                itemName
                                isEnable
                                settingsType {
                                    typeName
                                }
                            }
                        }
                        listingData {
                            checkInStart
                            checkInEnd
                            basePrice
                            cleaningPrice
                            currency
                            weeklyDiscount
                            monthlyDiscount
                            taxRate
                            cancellation {
                                id
                                policyName
                            }
                        }
                        listBlockedPrice {
                            id
                            listId
                            isSpecialPrice
                            blockedDates
                        }
                    }
                }
            `;

      const { data } = await client.query({
        query,
        variables: {
          listId,
        },
      });

      if (data && data.UserListing) {
        const userListing = data.UserListing;
        console.log('data', data);
        console.log('userListing', userListing);

        await dispatch({
          type: BOOKING_PROCESS_SUCCESS,
          payload: {
            data: userListing,
            bookDetails: {
              guests,
              startDate,
              endDate,
              preApprove,
              prePayment,
              totalPayment,
                            // taxRate,
            },
            bookingLoading: false,
          },
        });

        if (paynow) {
          console.log('prePayment', prePayment);
          console.log('totalPayment', totalPayment);
          let guestServiceFee = prePayment,
            hostServiceFee = 0,
            priceForDays = 0,
            hostServiceFeeType = '',
            hostServiceFeeValue = 0,
            discount = 0,
            discountType,
            total = 0,
            totalWithoutFees = 0,
            momentStartDate = moment(startDate),
            momentEndDate = moment(endDate),
            dayDifference = momentEndDate.diff(momentStartDate, 'days'),
            isAverage = 0,
            currentDay,
            bookingSpecialPricing = [],
            isSpecialPriceAssigned = false,
            isDayTotal = 0,
            taxRateFee = 0,
            totalWithoutServiceFee = totalPayment,
            discountLessBasePrice = 0,
            cleaningPrice = userListing.listingData.cleaningPrice;

          if (dayDifference > 0) {
            const stayedNights = [];
                    // Find stayed nights
            for (let i = 0; i < dayDifference; i++) {
              const currentDate = momentStartDate.add(i, 'day');
              stayedNights.push(currentDate);
            }

            if (stayedNights && stayedNights.length > 0) {
              stayedNights.map((item, key) => {
                let isSpecialPricing;
                if (item) {
                  let pricingRow,
                    currentPrice;
                  currentDay = moment(item)
                                    .format('dddd')
                                    .toLowerCase();
                                // isSpecialPricing = specialPricing.find(o => moment(item).format('MM/DD/YYYY') == moment(o.blockedDates).format('MM/DD/YYYY'));
                  isSpecialPricing = userListing.listBlockedPrice.find(
                                    o =>
                                        moment(item).format('MM/DD/YYYY') == moment(o.blockedDates).format('MM/DD/YYYY'),
                                );

                  if (isSpecialPricing && isSpecialPricing.isSpecialPrice) {
                    isSpecialPriceAssigned = true;
                    currentPrice = Number(isSpecialPricing.isSpecialPrice);
                  } else {
                    currentPrice = Number(userListing.listingData.basePrice);
                  }
                                // Price object
                  pricingRow = {
                    blockedDates: item,
                    isSpecialPrice: currentPrice,
                  };
                  bookingSpecialPricing.push(pricingRow);
                }
              });
            }
          }

          if (isSpecialPriceAssigned) {
            bookingSpecialPricing.map((item, index) => {
              priceForDays += Number(item.isSpecialPrice);
            });
          } else {
            bookingSpecialPricing.map((item, index) => {
              priceForDays += Number(item.isSpecialPrice);
            });
          }

          isAverage = Number(priceForDays) / Number(dayDifference);
          isDayTotal = isAverage.toFixed(2) * dayDifference;
          priceForDays = isDayTotal;

          if (dayDifference >= 7) {
            if (userListing.listingData.monthlyDiscount > 0 && dayDifference >= 28) {
              discount = (Number(priceForDays) * Number(userListing.listingData.monthlyDiscount)) / 100;
              discountType = `${userListing.listingData.monthlyDiscount}% monthly price discount`;
            } else if (userListing.listingData.weeklyDiscount > 0) {
              discount = (Number(priceForDays) * Number(userListing.listingData.weeklyDiscount)) / 100;
              discountType = `${userListing.listingData.weeklyDiscount}% weekly price discount`;
            }
          }

          discountLessBasePrice = isDayTotal - discount;
          taxRateFee =
                    taxRate && taxRate > 0 ? (discountLessBasePrice + cleaningPrice) * (Number(taxRate) / 100) : 0;
          totalWithoutServiceFee = isDayTotal + cleaningPrice - discount;

          const serviceFees = getState().book.serviceFees;

          if (serviceFees) {
            if (serviceFees.host.type === 'percentage') {
              hostServiceFeeType = serviceFees.host.type;
              hostServiceFeeValue = serviceFees.host.value;
              hostServiceFee = totalWithoutServiceFee * (Number(serviceFees.host.value) / 100);
            } else {
              hostServiceFeeType = serviceFees.host.type;
              hostServiceFeeValue = serviceFees.host.value;
              hostServiceFee = convert(
                            base,
                            rates,
                            serviceFees.host.value,
                            serviceFees.host.currency,
                            currency,
                        );
            }
          }

          total = priceForDays + guestServiceFee + cleaningPrice - discount;

          console.log('guestServiceFee', guestServiceFee);
          console.log('hostServiceFee', hostServiceFee);

          console.log('total', total);
          console.log('totalWithoutFees', totalWithoutFees);

          await dispatch(
                    makePayment(
                        listId,
                        userListing.title,
                        userListing.userId,
                        getState().user.id,
                        startDate,
                        endDate,
                        guests,
                        '',
                        userListing.listingData.basePrice,
                        userListing.listingData.cleaningPrice,
                        userListing.listingData.currency,
                        discount,
                        discountType,
                        guestServiceFee,
                        hostServiceFee,
                        total,
                        userListing.bookingType,
                        userListing.listingData.currency,
                        '3',
                        getState().user.email,
                        JSON.stringify(bookingSpecialPricing),
                        isSpecialPriceAssigned,
                        isAverage.toFixed(2),
                        dayDifference,
                        null,
                        null,
                        userListing.listingData.checkInStart,
                        userListing.listingData.checkInEnd,
                        getState().book.serviceFees.host.type,
                        getState().book.serviceFees.host.value,
                    ),
                );
        } else {
          console.log('12345');
          history.push(`/book/${listId}`);
        }
      }
    } catch (error) {
      dispatch({
        type: BOOKING_PROCESS_ERROR,
        payload: {
          error,
          bookingLoading: false,
        },
      });
      return false;
    }

    return true;
  };
}
