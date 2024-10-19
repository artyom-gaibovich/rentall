import React, { Component, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
	Button,
	Grid,
	Row,
	Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Meetup.css';
import bt from '../../../components/commonStyle.css';
import logoUrl from './home.png';

import { connect } from 'react-redux';
import validator from 'validator';
import { setRuntimeVariable } from '../../../actions/runtime';
import { loadAccount } from '../../../actions/account';
import InputMask from 'react-input-mask';
import SvgLogo from '../../Logo/SvgLogo';
// Component
import Avatar from '../../Avatar';

// Locale
import messages from '../../../locale/messages';

class Meetup extends Component {
  static propTypes = {
    hostDisplayName: PropTypes.string.isRequired,
    hostPicture: PropTypes.string,
    guestDisplayName: PropTypes.string,
    guestPicture: PropTypes.string,
    nextPage: PropTypes.any.isRequired,
    emailVerified: PropTypes.bool.isRequired,
    formatMessage: PropTypes.any,
    bookingData: PropTypes.object.isRequired,
    rent: PropTypes.number.isRequired,
    transfer: PropTypes.number.isRequired,
    nutrition: PropTypes.number.isRequired,
    huntsman: PropTypes.number.isRequired,
    assistant: PropTypes.number.isRequired,
    addition: PropTypes.string.isRequired,
    updateValues: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      phone: '',
      lastName: '',
      firstName: '',
      additionChecked: false,
      addition: '',
      selectedServices: [],
      isChanged: {
        firstName: false,
        lastName: false,
        phone: false,
        email: false,
      },
    };
    // state = {
    //   disabled: false
    // }

    this.handleClick = this.handleClick.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleCheckboxChange = (e, service) => {
    const status = e.target.checked ? 1 : 0;
    if (service === 'addition') {
      this.setState({
        additionChecked: e.target.checked,
        addition: e.target.checked ? '' : this.state.addition,
      });
    } else {
      this.setState({ [service]: status }, () => {
        // Тут используется обновлённое состояние
        this.props.updateValues({ [service]: status });
      });
    }
  };

  handleInputChange = (e) => {
    this.setState({ addition: e.target.value });
  };


  async handleClick() {
    // if (this.state.disabled) {

    //   return false
    // }
    console.log('user auth start booking');
    // await this.hiddenUpdate()
    // return false
    const { selectedServices, nextPage, emailVerified, guestPicture } = this.props;
    this.props.updateValues({ addition: this.state.addition });
    console.log('selectedServices', selectedServices);
    nextPage('payment');
  }
  componentDidMount() {
    // this.handleClick()

    try {
      ym(92387837, 'reachGoal', 'sale_success_preview');
      console.log('sale_success_preview');
    } catch (e) {
      console.log('reachGoal', e);
    }
    if (this.props.account.email.indexOf('anonymousEmail') >= 0 && !this.props.account.phoneNumber) {
      this.setState({
        showForm: true,
        disabled: true,
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        isChanged: {
          firstName: false,
          lastName: false,
          phone: false,
          email: false,
        },
      });
    }
  }

  handleChange(e, type) {
    this.setState({
      ...this.state,
      disabled: false,
      isChanged: {
        ...this.state.isChanged,
        [type]: true,
      },
      [type]: e.target.value,
    }, async () => {


    });
  }
  async hiddenUpdate() {
    const query = `query (
      $profileId:Int!,
      $phoneNumber: String,
      $userId: String,
      $email: String,
      $firstName: String,
      $lastName: String,
    ) {
        updateUserHidden (
          profileId:$profileId,
          phoneNumber:$phoneNumber,
          userId:$userId,
          email:$email,
          firstName:$firstName,
          lastName:$lastName
        ) {
          profileId
        }
      }`;

    const params = {
      phoneNumber: this.state.phone.replace('+7', '').replace(/\D/g, ''),
      email: this.state.email,
      profileId: this.props.account.profileId,
      userId: this.props.account.userId,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
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

    this.props.dispatch(loadAccount());
    this.props.dispatch(setRuntimeVariable({
      name: 'isAuthenticated',
      value: true,
    }));
  }
  render() {
    const { hostDisplayName, hostPicture, guestDisplayName, bookingData } = this.props;
    const { rent, transfer, nutrition, huntsman, assistant, addition } = this.props;
    const { additionChecked } = this.state;

    console.log(rent, transfer, nutrition, huntsman, assistant, addition);

    console.log('bookingData1', bookingData);
    console.log('bookingData1Type', typeof bookingData);
    // bookingData.rent = 1;
    console.log('bookingData2', bookingData);

    return (
      <Grid>
        <Row>
          <div className={s.activationStepPanel}>
            <div className={s.panelBody}>
              <h2 className={s.titleMeetup}><span>Доступны дополнительные услуги!</span></h2>
              <h3>Выберите понравившиеся!</h3>
              <div className={s.MeetupContentSection}>
                <div className={s.MeetupContentSectionLeft}>
                  <div className={s.MeetupContentSectionLogo}>
                    <SvgLogo className={s.SvgLogo} />
                  </div>
                  <p className={s.MeetupContentSectionLeftText}>GOODTRIP старается сделать ваш отдых максимально комфортным</p>
                </div>
                <div className={s.MeetupContentSectionRight}>
                  <div className={s.checkboxesMeetup}>
                    <label className={s.checkboxMeetup}>
                      <input type="checkbox" checked={rent} onChange={e => this.handleCheckboxChange(e, 'rent')} />
                        Аренда лодок/снегоходов
                      </label>
                    <label className={s.checkboxMeetup}>
                      <input type="checkbox" checked={transfer} onChange={e => this.handleCheckboxChange(e, 'transfer')} />
                        Трансфер от аэропорта/вокзала
                      </label>
                    <label className={s.checkboxMeetup}>
                      <input type="checkbox" checked={nutrition} onChange={e => this.handleCheckboxChange(e, 'nutrition')} />
                        Питание
                      </label>
                    <label className={s.checkboxMeetup}>
                      <input type="checkbox" checked={huntsman} onChange={e => this.handleCheckboxChange(e, 'huntsman')} />
                        Егерь
                      </label>
                    <label className={s.checkboxMeetup}>
                      <input type="checkbox" checked={assistant} onChange={e => this.handleCheckboxChange(e, 'assistant')} />
                        Помощник по хозяйтсву
                      </label>
                    <label className={s.checkboxMeetup}>
                      <input
                        type="checkbox"
                        checked={additionChecked}
                        onChange={e => this.handleCheckboxChange(e, 'addition')}
                      />
                        Необходимо что ещё?
                      </label>
                    {additionChecked && (
                    <div className={s.additionInputBox}>
                      <textarea
                        type="text"
                        placeholder="Введите дополнитель..."
                        value={this.state.addition}
                        onChange={this.handleInputChange}
                        className={s.additionInput}
                        maxLength="255"
                      />
                      <strong>В текстовом поле кратко опишите необходимую услугу(например, «ГСМ», «Аренда снасти» и т.д.)</strong>
                    </div>
                      )}
                  </div>
                </div>
              </div>
              <div className={cx(s.space4, s.spaceTop4)}>
                {/* <p className={cx(s.space2, s.spaceTop2, s.textLead)}>
                  <span><FormattedMessage {...messages.meetupInfo1} /></span>
                </p>
                <p className={cx(s.space4, s.textLead)}>
                  <span><FormattedMessage {...messages.meetupInfo2} /></span>
                </p> */}


                {this.state.showForm && <div className={s.fields}>
                  <label className={s.field}>
                    <span>Ваше имя</span>
                    <input
                      onChange={(e) => {
                        this.handleChange(e, 'firstName');
                      }} type="text" className={bt.commonControlInput}
                    />
                    <span className={bt.errorHelper}>{!this.state.firstName && this.state.isChanged.firstName ? 'Поле обязательно для заполнения' : ''}</span>
                  </label>

                  <label className={s.field}>
                    <span>Ваша фамилия</span>
                    <input
                      onChange={(e) => {
                        this.handleChange(e, 'lastName');
                      }} type="text" className={bt.commonControlInput}
                    />
                    <span className={bt.errorHelper}>{ !this.state.lastName && this.state.isChanged.lastName ? 'Поле обязательно для заполнения' : '' }</span>
                  </label>


                  <label className={s.field}>
                    <span>Номер телефона</span>
                    <InputMask
                      mask="+7(999)999-99-99"
                      onChange={e => this.handleChange(e, 'phone')} type="text" className={bt.commonControlInput}
                    >
                      {props => <input {...props} />}
                    </InputMask>
                    <span className={bt.errorHelper}>{!validator.isMobilePhone(this.state.phone.replace(/\D/g, '')) && this.state.isChanged.phone ? 'Укажите номер вашего телефона' : '' }</span>
                  </label>
                  <label className={s.field}>
                    <span>Email</span>
                    <input onChange={e => this.handleChange(e, 'email')} type="email" className={bt.commonControlInput} />
                    <span className={bt.errorHelper}>{!validator.isEmail(this.state.email) && this.state.isChanged.email ? 'Поле должно содержать email' : '' }</span>
                  </label>
                  </div>}
                <Col xs={12} sm={12} md={12} lg={12} className={s.space3}>
                  {!this.state.rent && !this.state.transfer && !this.state.nutrition && !this.state.huntsman && !this.state.assistant && !this.state.addition ? (
                    <Button
                      disabled={
                      this.state.showForm &&
                      (
                        !this.state.phone ||
                        !this.state.email ||
                        !validator.isEmail(this.state.email) ||
                        !validator.isMobilePhone(this.state.phone.replace(/\D/g, '')) ||
                        !this.state.firstName ||
                        !this.state.lastName
                      )
                    } className={cx(bt.btnPrimary, bt.btnLarge, bt.fullWidth, s.btn, s.btnDisabled)} onClick={this.handleClick}
                    >
                    Ничего не интересует
                  </Button>
                  ) : (
                    <Button
                      disabled={
                      this.state.showForm &&
                      (
                        !this.state.phone ||
                        !this.state.email ||
                        !validator.isEmail(this.state.email) ||
                        !validator.isMobilePhone(this.state.phone.replace(/\D/g, '')) ||
                        !this.state.firstName ||
                        !this.state.lastName
                      )
                    } className={cx(bt.btnPrimary, bt.btnLarge, bt.fullWidth, s.btn)} onClick={this.handleClick}
                    >
                      <FormattedMessage {...messages.next} />
                    </Button>
                  )}
                </Col>
              </div>
            </div>
          </div>
        </Row>
      </Grid>
    );
  }
}

const mapState = state => ({

});
const mapDispatch = dispatch => ({
  dispatch,
});
export default withStyles(s, bt)(connect(mapState, mapDispatch)(Meetup));

// export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(BookingButton)));
// export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(BookingForm)));
//
