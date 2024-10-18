import React, { Component } from 'react';
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
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      phone: '',
      lastName: '',
      firstName: '',
      isChanged: {
        firstName: false,
        lastName: false,
        phone: false,
        email: false,
      }
    }
    // state = {
    //   disabled: false
    // }
   
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount () {

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
        }
      })
    }
  }
 async handleClick() {
    if (this.state.disabled) {

      return false
    }
    await this.hiddenUpdate()
    // return false
    const { nextPage, emailVerified, guestPicture } = this.props;
    if (guestPicture === null) {
      // nextPage('avatar');
      nextPage('payment');
    } else {
      nextPage('payment');
    }
  }
  handleChange (e, type) {
    this.setState({
      ...this.state,
      disabled: false,
      isChanged: {
        ...this.state.isChanged,
        [type]: true
      },
      [type]: e.target.value
    }, async () => {

        
    })
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
      lastName: this.state.lastName
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
    const { hostDisplayName, hostPicture, guestDisplayName } = this.props;

    return (
      <Grid>
        <Row>
          <div className={s.activationStepPanel}>
            <div className={s.panelBody}>
              <h2><span><FormattedMessage {...messages.meetupTitle} /> {hostDisplayName}</span></h2>
              <div className={cx(s.spaceTop5)}>
                <div className={s.userLeft}>
                  <Avatar
                  source={hostPicture}
                  title={hostDisplayName}
                  className={cx(s.profileImage, s.mediaPhoto, s.mediaRound)}
                />
                </div>
                <div className={cx(s.userRight, s.logoIcon)}>
                  <div className={cx(s.mediaRound, s.highlightedIcon)}>
                  <img
                    src={logoUrl}
                    className={cx(s.logoImage, s.mediaPhoto, s.mediaRound)}
                  />
                </div>
                </div>
                <div className={s.userRight}>
                  <Avatar
                  isUser
                  title={guestDisplayName}
                  className={cx(s.profileImage, s.mediaPhoto, s.mediaRound)}
                />
                </div>
                <p className={cx(s.space2, s.spaceTop2, s.textLead)}>
                  <span><FormattedMessage {...messages.meetupInfo1} /></span>
                </p>
                <p className={cx(s.space4, s.textLead)}>
                  <span><FormattedMessage {...messages.meetupInfo2} /></span>
                </p>
                {this.state.showForm && <div className={s.fields}>
                  <label className={s.field}>
                    <span>Ваше имя</span>
                    <input onChange={e => {
                      this.handleChange(e, 'firstName')
                    }} type="text" className={bt.commonControlInput}></input>
                     <span className={bt.errorHelper}>{!this.state.firstName && this.state.isChanged.firstName ? 'Поле обязательно для заполнения' : ''}</span>
                  </label>

                  <label className={s.field}>
                    <span>Ваша фамилия</span>
                    <input onChange={e => {
                      this.handleChange(e, 'lastName')
                    }} type="text" className={bt.commonControlInput}></input>
                    <span className={bt.errorHelper}>{ !this.state.lastName && this.state.isChanged.lastName ? 'Поле обязательно для заполнения' : '' }</span>
                  </label>
                  
                 

                  <label className={s.field}>
                    <span>Номер телефона</span>
                    <InputMask
                      mask="+7(999)999-99-99"
                      onChange={e =>  this.handleChange(e, 'phone')} type="text" className={bt.commonControlInput}
                    >
                      {(props) => <input  {...props}></input>}
                    </InputMask>
                     <span className={bt.errorHelper}>{!validator.isMobilePhone(this.state.phone.replace(/\D/g, '')) && this.state.isChanged.phone ? 'Укажите номер вашего телефона': '' }</span>
                  </label>
                  <label className={s.field}>
                    <span>Email</span>
                    <input onChange={e => this.handleChange(e, 'email')} type="email" className={bt.commonControlInput}></input>
                    <span className={bt.errorHelper}>{!validator.isEmail(this.state.email) && this.state.isChanged.email ? 'Поле должно содержать email' : '' }</span> 
                  </label>
                </div>}
                <Col xs={12} sm={12} md={12} lg={12} className={s.space3}>
                  <Button disabled={
                    this.state.showForm && 
                    (
                      !this.state.phone || 
                      !this.state.email || 
                      !validator.isEmail(this.state.email) || 
                      !validator.isMobilePhone(this.state.phone.replace(/\D/g, '')) || 
                      !this.state.firstName || 
                      !this.state.lastName
                    )
                  } className={cx(bt.btnPrimary, bt.btnLarge, bt.fullWidth)} onClick={this.handleClick}>
                  <FormattedMessage {...messages.next} />
                </Button>
                <p className='ps-footer' style={{color:"red"}}><FormattedMessage {...messages.meetupInfoTip}/></p>
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
const mapDispatch = (dispatch) => {
  return {
    dispatch
  }
};
export default withStyles(s, bt)(connect(mapState, mapDispatch)(Meetup));

// export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(BookingButton)));
// export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(BookingForm)));
// 