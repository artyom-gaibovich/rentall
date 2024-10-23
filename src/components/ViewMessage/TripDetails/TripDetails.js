import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';

import {
	Row,
	Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';
import * as FontAwesome from 'react-icons/lib/fa';

// Component
import PaymentDetails from './PaymentDetails';
import CancelDetails from './CancelDetails';

// Locale
import messages from '../../../locale/messages';

class TripDetails extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    listId: PropTypes.number.isRequired,
    userType: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    personCapacity: PropTypes.number.isRequired,
    basePrice: PropTypes.number.isRequired,
    cleaningPrice: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    monthlyDiscount: PropTypes.number,
    weeklyDiscount: PropTypes.number,
    specialPricing: PropTypes.array,
    cancelData: PropTypes.shape({
      guestServiceFee: PropTypes.number,
      hostServiceFee: PropTypes.number,
      refundToGuest: PropTypes.number,
      payoutToHost: PropTypes.number,
      total: PropTypes.number,
      currency: PropTypes.string,
    }),
    reservationData: PropTypes.any,
  };

  static defaultProps = {
    title: '',
    startDate: null,
    endDate: null,
    personCapacity: 0,
    reservationData: null,
    specialPricing: [],
  };

  render() {
    const { title, endDate, personCapacity, listId, reservationData, specialPricing } = this.props;
    const { formatMessage } = this.props.intl;
    const { basePrice, cleaningPrice, weeklyDiscount, monthlyDiscount, userType, currency, cancelData } = this.props;
    let { startDate } = this.props;
    const serviceFees = { guest: { currency: 'RUB', type: 'percentage', value: 20 } };
    moment.locale('ru');
    const checkIn = startDate != null ? moment(startDate).format('ddd, Do MMM') : '';
    const checkOut = startDate != null ? moment(endDate).format('ddd, Do MMM') : '';

    let serviceFee = 0,
      serviceFeeCurrency;
    let currentDay,
      bookingSpecialPricing = [],
      isSpecialPriceAssigned = false;
    let priceForDays = 0,
      isAverage = 0;
    let isDayTotal = 0;

    let momentStartDate,
      momentEndDate,
      dayDifference,
      discount,
      discountType,
      total,
      taxRateFee,
      totalWithoutServiceFee = 0,
      discountLessBasePrice = 0;
    if (startDate != null && endDate != null) {
      startDate = moment(startDate).format('YYYY-MM-DD');
      momentStartDate = moment(startDate);
      momentEndDate = moment(endDate);
      dayDifference = momentEndDate.diff(momentStartDate, 'days');

      if (dayDifference > 0) {
        const stayedNights = [];
              // Find stayed nights
        for (let i = 0; i < dayDifference; i++) {
          const currentDate = moment(startDate).add(i, 'day');
          stayedNights.push(currentDate);
        }

        if (stayedNights && stayedNights.length > 0) {
          stayedNights.map((item, key) => {
            let isSpecialPricing;
            if (item) {
              let pricingRow,
                currentPrice;
              currentDay = (moment(item).format('dddd').toLowerCase());
              isSpecialPricing = specialPricing.find(o => moment(item).format('MM/DD/YYYY') == moment(o.blockedDates).format('MM/DD/YYYY'));
              if (isSpecialPricing && isSpecialPricing.isSpecialPrice) {
                isSpecialPriceAssigned = true;
                currentPrice = Number(isSpecialPricing.isSpecialPrice);
              } else {
                currentPrice = Number(basePrice);
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
              // priceForDays = Number(basePrice) * Number(dayDifference);
      }
          // priceForDays = Number(basePrice) * Number(dayDifference);
      discount = 0;
      discountType = null;
      total = 0;
    }

    const priceForDaysTmp = priceForDays;
    priceForDays -= (priceForDays * (Number(serviceFees.guest.value) / 100));
    isAverage = Number(priceForDays) / Number(dayDifference);
    const isAverageTmp = Number(priceForDaysTmp) / Number(dayDifference);
    isDayTotal = isAverage.toFixed(2) * dayDifference;
    const isDayTotalTmp = isAverageTmp.toFixed(2) * dayDifference;
    priceForDays = isDayTotal;

    if (dayDifference >= 7) {
      if (monthlyDiscount > 0 && dayDifference >= 28) {
        discount = (Number(priceForDays) * Number(monthlyDiscount)) / 100;
        discountType = `${monthlyDiscount}% ${formatMessage(messages.monthlyDiscount)}`;
      } else {
        discount = (Number(priceForDays) * Number(weeklyDiscount)) / 100;
        discountType = `${weeklyDiscount}% ${formatMessage(messages.weeklyDiscount)}`;
      }
    }
    discountLessBasePrice = isDayTotalTmp - discount;
      // taxRateFee = taxRate && taxRate > 0 ? ((discountLessBasePrice + cleaningPrice) * (Number(taxRate) / 100)) : 0;
      // totalWithoutServiceFee = (isDayTotal + cleaningPrice + taxRateFee) - discount;
    totalWithoutServiceFee = (isDayTotalTmp + cleaningPrice) - discount;

    if (serviceFees) {
      if (serviceFees.guest.type === 'percentage') {
        serviceFee = totalWithoutServiceFee * (Number(serviceFees.guest.value) / 100);
      } else {
        serviceFee = convert(base, rates, serviceFees.guest.value, serviceFees.guest.currency, currency);
      }
    }

    total = (priceForDays + serviceFee + cleaningPrice) - discount;

    console.log(serviceFee, 'serviceFee');
    console.log(total, 'total');

    let isCancelled = false;
    if (cancelData) {
      isCancelled = true;
    }
    return (
      <div className={cx(s.space4, s.spaceTop6, s.sidebarContainer)}>
        <div className={s.space4}>
          <h4><FormattedMessage {...messages.tripDetails} /></h4>
        </div>
        <div className={s.space4}>
          {/* <Link to={"/rooms/" + listId} className={s.timeText}> */}
          <a href={`/rooms/${listId}`} target="_blank">
            <h4>{title}</h4>
          </a>
          {/* </Link> */}
        </div>
        <div className={s.space2}>
          <hr className={s.horizondalLine} />
          <Row className={cx(s.spaceTop3, s.space3)}>
            <Col xs={5} sm={5} className={s.noPaddingRight}>
              <div className={cx(s.textGray, s.space1)}>
                <span><FormattedMessage {...messages.checkIn} /></span>
              </div>
              <div className={s.checkInDate}>{checkIn}</div>
            </Col>
            <Col xs={1} sm={1}>
              <FontAwesome.FaChevronRight className={cx(s.textGray, s.chevronIcon)} />
            </Col>
            <Col xs={5} sm={5} className={cx(s.pullRight, s.textLeft, 'viewMessageCheckOutSection')}>
              <div className={cx(s.textGray, s.space1)}>
                <span><FormattedMessage {...messages.checkOut} /></span>
              </div>
              <div className={s.checkInDate}>{checkOut}</div>
            </Col>
          </Row>
          <hr className={s.horizondalLine} />
        </div>
        <div className={s.space2}>
          <div className={cx(s.textGray, s.space1)}>
            <span><FormattedMessage {...messages.guests} /></span>
          </div>
          <div className={s.space3}>
            <span>{personCapacity} {personCapacity > 1 ? formatMessage(messages.guestsCapcity) : formatMessage(messages.guestCapcity)}</span>
          </div>
          <hr className={s.horizondalLine} />
          <div className={cx(s.textGray, s.space1)}>
            <span>Предоплата</span>
          </div>
          <div className={s.space3}>
            <span>{serviceFee.toFixed(0)}р</span>
          </div>
          <hr className={s.horizondalLine} />
          <div className={cx(s.textGray, s.space1)}>
            <span>Полная цена</span>
          </div>
          <div className={s.space3}>
            <span>{total.toFixed(0)}р</span>
          </div>
          <hr className={s.horizondalLine} />
          {
						!isCancelled && reservationData && <PaymentDetails
  userType={userType}
  startDate={startDate}
  endDate={endDate}
  basePrice={basePrice}
  cleaningPrice={cleaningPrice}
  weeklyDiscount={weeklyDiscount}
  monthlyDiscount={monthlyDiscount}
  currency={currency}
  reservationData={reservationData}
						/>
					}

          {
						isCancelled && <CancelDetails
  userType={userType}
  cancelData={cancelData}
  reservationData={reservationData}
						/>
					}

        </div>
      </div>
    );
  }
}

export default injectIntl(withStyles(s)(TripDetails));

