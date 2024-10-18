import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
// Style
import { connect } from 'react-redux';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Calendar.css';
import bt from '../../../components/commonStyle.css';
import {
    Button,
    FormGroup,
} from 'react-bootstrap';
import cx from 'classnames';
// Component
import Loader from '../../Loader';
import history from '../../../core/history';

import { setRuntimeVariable } from '../../../actions/runtime';
import { loadAccount } from '../../../actions/account';

// Locale
import messages from '../../../locale/messages';
import { openLoginModal } from '../../../actions/modalActions';

class BookingButton extends Component {
  static propTypes = {
    availability: PropTypes.bool.isRequired,
    isDateChosen: PropTypes.bool.isRequired,
    basePrice: PropTypes.number.isRequired,
    isHost: PropTypes.bool.isRequired,
    bookingProcess: PropTypes.any.isRequired,
    listId: PropTypes.number.isRequired,
    guests: PropTypes.number.isRequired,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    bookingType: PropTypes.string.isRequired,
    bookingLoading: PropTypes.bool,
    formatMessage: PropTypes.any,
    maximumStay: PropTypes.bool,
    userBanStatus: PropTypes.number,
  };
  static defaultProps = {
    availability: true,
    isDateChosen: false,
    bookingLoading: false,
  }
  constructor(props) {
    super(props);
    // console.log('BOOKBTN', props)
    this.handleClick = this.handleClick.bind(this);
    this.hanldeChange = this.hanldeChange.bind(this);
  }
   async handleClick() {
    const { bookingProcess, listId, guests, startDate, endDate, taxRate } = this.props;
    // if (!this.props.account) {
    //   await this.hiddenRegister()
    // }
    // console.log('user auth start booking');
    // console.log(this.props);
     bookingProcess(listId, guests, startDate, endDate, null, taxRate);
    // // console.log({bookingProcessHandler});
    // const result = await bookingProcessHandler();
    // // console.log({result});
    // console.log('user auth end booking');

   
  }
  async hiddenRegister() {

    const query = `query (
      $firstName:String,
      $lastName:String,
      $email: String!,
      $password: String!,
      $dateOfBirth: String
    ) {
        userRegister (
          firstName:$firstName,
          lastName:$lastName,
          email: $email,
          password: $password,
          dateOfBirth: $dateOfBirth
        ) {
          emailToken
          status
        }
      }`;
  
    const dateOfBirth = `05-1990-$23`;
  
    const params = {
      firstName: `anonymousFirstName_${Date.now()}`,
      lastName: `anonymousLastName_${Date.now()}`,
      email: `anonymousEmail@${Date.now()}.ru`,
      password: `anonymousPassword_${Date.now()}`,
      dateOfBirth,
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
    // console.log('hidden register response', data)
    this.props.dispatch(loadAccount());
    this.props.dispatch(setRuntimeVariable({
      name: 'isAuthenticated',
      value: true,
    }));
  }
  hanldeChange() {
    history.push('/s');
  }
  render() {
    const { basePrice, userBanStatus, isDateChosen, availability, isHost, bookingType, bookingLoading, taxRate, guests  } = this.props;
    const { formatMessage } = this.props.intl;
    const { maximumStay, minimumStay } = this.props;
    let disabled,
      buttonLabel;
    // if (!isDateChosen || basePrice < 1 || isHost || maximumStay || userBanStatus || minimumStay) {
      if (!isDateChosen || basePrice < 1 || isHost || maximumStay || minimumStay || !guests) {
      disabled = true;
    } else {
      disabled = false;
    }
    if (bookingType === 'instant') {
      buttonLabel = messages.book;
    } else {
      buttonLabel = messages.requestToBook;
    }
    if (!availability && isDateChosen) {
      return (
        <div>
          <FormGroup className={s.formGroup}>
            <Button className={cx(s.btn, s.btnBlock, bt.btnLarge, bt.btnPrimaryBorder)} disabled={disabled} onClick={this.hanldeChange}>
              <FormattedMessage {...messages.viewOtherListings} />
            </Button>
          </FormGroup>
        </div>
      );
    }
    return (
      <FormGroup className={s.formGroup}>
        <Loader
          type={'button'}
          className={cx(s.btn, s.btnBlock, bt.btnLarge, bt.btnPrimary, 'arButtonLoader')}
          handleClick={() => this.props.account ? this.handleClick() : this.props.dispatch(openLoginModal())}
          disabled={disabled}
          show={bookingLoading}
          label={formatMessage(buttonLabel)}
        />
      </FormGroup>
    );
  }
}
const mapState = state => ({

});
const mapDispatch = (dispatch) => {
  return {
    dispatch
  }
};
export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(BookingButton)));
// export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(BookingForm)));
// 