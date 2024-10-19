import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

// Redux
import { connect } from 'react-redux';

// Redux Form
import { Field, reduxForm, formValueSelector } from 'redux-form';


import { setRuntimeVariable } from '../../../actions/runtime';
import { loadAccount } from '../../../actions/account';
// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContactHost.css';
import bt from '../../../components/commonStyle.css';
import cx from 'classnames';
import {
  Button,
  Form,
  Row,
  Col,
  FormControl,
  Modal,
  Panel,
} from 'react-bootstrap';

// Helper
import validate from './validate';
import submit from './submit';

// Component
import DateRange from '../DateRange';
import Avatar from '../../Avatar';
import Loader from '../../Loader';
import InputMask from 'react-input-mask';
import validator from 'validator';

// Redux Action
import { contactHostClose } from '../../../actions/message/contactHostModal';

import { bookingProcess } from '../../../actions/booking/bookingProcess';

// Locale
import messages from '../../../locale/messages';

class ContactHost extends React.Component {
  static propTypes = {
    showContactHostModal: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    picture: PropTypes.string,
    profileId: PropTypes.number.isRequired,
    personCapacity: PropTypes.number.isRequired,
    minNight: PropTypes.number,
    maxNight: PropTypes.number,
    maxDaysNotice: PropTypes.string,
    blockedDates: PropTypes.array,
    availability: PropTypes.bool,
    startDate: PropTypes.object,
    account: PropTypes.object,
    endDate: PropTypes.object,
    contactHostClose: PropTypes.any.isRequired,
    formatMessage: PropTypes.any,
    maximumStay: PropTypes.bool,
    country: PropTypes.string,
  };

  static defaultProps = {
    showContactHostModal: false,
    id: 0,
    userId: null,
    profileId: 0,
    city: null,
    displayName: null,
    picture: null,
    personCapacity: 1,
    minNight: 0,
    maxNight: 0,
    blockedDates: [],
    availability: false,
    startDate: null,
    endDate: null,
    maximumStay: false,
    country: null,
  };

  constructor(props) {
    super(props);
    this.renderGuests = this.renderGuests.bind(this);
    this.renderFormControlSelect = this.renderFormControlSelect.bind(this);
    this.renderFormControlTextArea = this.renderFormControlTextArea.bind(this);
    this.renderWarningBlock = this.renderWarningBlock.bind(this);
    // console.log('CONTACT HOST PROPS', this.props)
    this.state = {
      step: 1,
      email: '',
      phone: '',
      showForm: true,
      firstName: '',
      lastName: '',
      isChanged: {
        firstName: false,
        lastName: false,
        phone: false,
        email: false,
      },
    };
  }

  async handleClick() {
    const { bookingProcess, listId, guests, startDate, endDate, taxRate } = this.props;
    bookingProcess(listId, guests, startDate, endDate, null, taxRate);
  }

  renderGuests(personCapacity) {
    const { formatMessage } = this.props.intl;

    const rows = [];
    for (let i = 1; i <= personCapacity; i++) {
      rows.push(<option key={i} value={i}>{i} {i > 1 ? formatMessage(messages.guests) : formatMessage(messages.guest)}</option>);
    }
    return rows;
  }

  renderFormControlSelect({ input, label, meta: { touched, error }, children, className }) {
    // console.log(input)
    // console.log(children)
    // console.log(touched)
    // console.log(error)
    // input.value = input.value || '1'
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <FormControl componentClass="select" {...input} className={className} >
          {children}
        </FormControl>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      </div>
    );
  }


  renderFormControlTextArea({ input, label, meta: { touched, error }, children, className, placeholder }) {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <FormControl
          {...input}
          className={className}
          componentClass="textarea"
          placeholder={placeholder}
        >

          {children}
        </FormControl>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      </div>
    );
  }

  renderWarningBlock(content, error) {
    let bgClass;
    if (error) {
      bgClass = s.alertBlockError;
    } else {
      bgClass = s.alertBlockSuccess;
    }
    return (
      <div className={cx(s.alertBlock, bgClass, s.space4)}>
        <div>
          <div className={s.messageText}>
            {content}
          </div>
        </div>
      </div>
    );
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
       // console.log('handle change', this.state)

    });
  }

  closeModal() {
    this.props.dispatch({
      type: 'CONTACT_HOST_CLOSE',
      payload: {
        showContactHostModal: false,
      },
    });
  }
  async hiddenUpdate() {
    try {
      console.log('reachGoal2', 'question_ok');
      ym(92387837, 'reachGoal2', 'question_ok');
    } catch (e) {
      console.log('e', e);
    }
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
          lastName:$lastName,
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
    this.setState({
      step: 1,
      showForm: true,
    });
    const { data } = await resp.json();
    // console.log('hidden register response', data)
    this.props.dispatch(loadAccount());
    this.props.dispatch(setRuntimeVariable({
      name: 'isAuthenticated',
      value: true,
    }));
  }


  componentDidMount() {
    this.setState({
      step: 1,
    });
    if (!this.props.account) {
      // console.log('CH no ACC')
      this.setState({
        ...this.state,
        showForm: false,
      });
      return;
    }
    if (this.props.account.email.indexOf('anonymousEmail') >= 0 && !this.props.account.phoneNumber) {
      // console.log('CH no ACC fill')

      this.setState({
        ...this.state,
        showForm: false,

      });
    }
  }
  render() {
    const { formatMessage } = this.props.intl;
    const { showContactHostModal, contactHostClose } = this.props;
    const { id, personCapacity, minNight, maxNight, maxDaysNotice, blockedDates, country } = this.props;
    const { userId, profileId, picture, displayName, city } = this.props;
    const { availability, startDate, endDate, isLoading, maximumStay } = this.props;
    const { error, handleSubmit, submitting, dispatch } = this.props;
    const isDateChosen = startDate != null && endDate != null || false;

    let disabled;
    if (!isDateChosen || !availability) {
      disabled = true;
    } else {
      disabled = false;
    }

    // let loadingStatus = loading || isLoading || false;
    const loadingStatus = isLoading || false;
    return (
      <div className={s.root}>
        <Modal show={showContactHostModal} onHide={contactHostClose} animation={false} className={cx(s.modalContainer, 'ContactHost')}>
          <div className={cx(s.modalTable)}>
            <div className={cx(s.modalCell)}>
              <Modal.Header className={s.modalHeading} closeButton>
                <Modal.Title><FormattedMessage {...messages.contactHost} /></Modal.Title>
              </Modal.Header>
              <Modal.Body bsClass={s.logInModalBody}>
                <div className={s.modalDark}>
                  <Row className={s.noMargin}>
                    <Col md={4} className={s.noPadding}>
                      <Panel className={cx(s.hostModal)}>
                        <div className={cx(s.textCenter, s.space2)}>
                          <div className={cx(s.mediaPhoto, s.mediaRound)}>
                            <div className={s.mediaBadge}>
                              <Avatar
                                source={picture}
                                height={120}
                                width={120}
                                title={displayName}
                                className={s.profileAvatar}
                                withLink
                                linkClassName={cx(s.mediaPhoto, s.mediaRound)}
                                profileId={profileId}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className={s.textCenter}>{displayName}</h5>
                          <hr className={cx(s.spaceTop2, s.space2)} />
                          <div>
                            <p><span><FormattedMessage {...messages.contactHostinfo1} />:</span></p>
                            <ul className={cx(s.listText, 'contactHostlistTextRTL')}>
                              <li>
                                <span>
                                  <FormattedMessage {...messages.contactHostinfo2} /> {displayName} <FormattedMessage {...messages.contactHostinfo3} />
                                </span>
                              </li>
                              <li>
                                <span>
                                  <FormattedMessage {...messages.contactHostinfo4} /> {city}?                                <FormattedMessage {...messages.contactHostinfo5} />?
                                </span>
                              </li>
                              <li>
                                <span><FormattedMessage {...messages.contactHostinfo6} />!</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </Panel>
                    </Col>
                    <Col md={8} className={s.noPadding}>
                      <Loader
                        show={loadingStatus}
                        type={'page'}
                      >
                        <Form
                          onSubmit={handleSubmit(submit)}
                        >
                          {this.state.step == 1 && <Panel className={cx(s.guestModal, 'guestpanel')}>
                            {
                            !isDateChosen && this.renderWarningBlock(<FormattedMessage {...messages.hostErrorMessage1} />)
                          }
                            {
                            !maximumStay && !availability && isDateChosen && this.renderWarningBlock(<p><FormattedMessage {...messages.hostErrorMessage2} /></p>, 'error')
                          }
                            {
                            isDateChosen && maximumStay && this.renderWarningBlock(<p><FormattedMessage {...messages.maximumStay} /> {maxNight} <FormattedMessage {...messages.nights} /></p>, 'error')
                          }
                            {
                            availability && isDateChosen && this.renderWarningBlock(<FormattedMessage {...messages.hostErrorMessage3} />)
                          }
                            <div className={s.panelBody}>
                              <h3 className={s.listTitle}><FormattedMessage {...messages.contactHostDate} />?</h3>
                              <div className={s.space4}>
                                <Row>
                                  {/* <Form onSubmit={handleSubmit(submit)}> */}
                                  <Col lg={12} md={12} sm={7} xs={12}>
                                    <span className={cx('ContactHost')}>
                                      <DateRange
                                        listId={id}
                                        minimumNights={minNight}
                                        maximumNights={maxNight}
                                        blockedDates={blockedDates}
                                        formName={'ContactHostForm'}
                                        maxDaysNotice={maxDaysNotice}
                                        country={country}
                                      />
                                    </span>
                                    {/* <span className={'ContactHost'}>
                                      <DateRange
                                        listId={id}
                                        minimumNights={minNight}
                                        maximumNights={maxNight}
                                        blockedDates={blockedDates}
                                        formName={'ContactHostForm'}
                                        maxDaysNotice={maxDaysNotice}
                                        country={country}

                                      />
                                    </span> */}
                                  </Col>
                                  <Col lg={12} md={12} sm={5} xs={12} className={cx(s.spaceTop2, s.smNomarginTop)}>
                                    <Field
                                      name="personCapacity"
                                      component={this.renderFormControlSelect}
                                      className={cx(s.formControlSelect, bt.commonControlSelect, 'viewGuestCount')}
                                    >
                                      <option value="">{formatMessage(messages.chooseGuests)}</option>
                                      {this.renderGuests(personCapacity)}
                                    </Field>
                                  </Col>
                                  <Col lg={12} md={12} sm={12} xs={12} className={s.spaceTop2}>
                                    <div className={s.messagePanel}>
                                      <Field
                                        name="content"

                                        component={this.renderFormControlTextArea}
                                        className={s.textBox}
                                        placeholder={formatMessage(messages.textBoxMessage)}
                                      />
                                    </div>
                                  </Col>
                                  <Col lg={12} md={12} sm={12} xs={12} className={s.spaceTop2}>
                                    {this.state.showForm && <Button className={cx(bt.btnPrimary, bt.btnLarge, bt.fullWidth)} type="submit" disabled={submitting || disabled}>
                                      <FormattedMessage {...messages.sendMessage} />
                                    </Button>}
                                    {!this.state.showForm && <button className={cx(bt.btnPrimary, bt.btnLarge, bt.fullWidth, s.fields__sub)} disabled={submitting || disabled} onClick={() => { this.setState({ step: 2 }); }}>
                                      <FormattedMessage {...messages.sendMessage} />
                                    </button>}

                                  </Col>
                                  {/* </Form> */}
                                </Row>
                              </div>
                            </div>
                          </Panel>}
                          {this.state.step == 2 && <Panel className={cx(s.guestModal, 'guestpanel')}>
                            <div className={s.fields}>
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

                              <Button
                                className={cx(bt.btnPrimary, bt.btnLarge, bt.fullWidth)}
                                type="submit"
                                disabled={
                              personCapacity < 1 ||
                              submitting ||
                              disabled ||
                              !this.state.phone ||
                              !this.state.email ||
                              !validator.isEmail(this.state.email) ||
                              !validator.isMobilePhone(this.state.phone.replace(/\D/g, '')) ||
                              !this.state.firstName ||
                              !this.state.lastName
                            }
                                onClick={() => {
                                  this.hiddenUpdate();
                                }}
                              >
                                <FormattedMessage {...messages.sendMessage} />
                              </Button>
                              {/* <span className={cx(bt.btnPrimary, bt.btnLarge, bt.fullWidth, s.fields__sub)} onClick={() => { this.hiddenUpdate() }}>Отправить</span> */}
                            </div>
                          </Panel>}
                        </Form>
                      </Loader>
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ContactHost = reduxForm({
  form: 'ContactHostForm', // a unique name for this form
  validate,
})(ContactHost);

// Decorate with connect to read form values
const selector = formValueSelector('ContactHostForm'); // <-- same as form name

const mapState = state => ({
  account: state.account.data,
  isLoading: state.viewListing.isLoading,
  showContactHostModal: state.viewListing.showContactHostModal,
  availability: state.viewListing.availability,
  maximumStay: state.viewListing.maximumStay,
  startDate: selector(state, 'startDate'),
  endDate: selector(state, 'endDate'),
});

// const mapDispatch = {
//   contactHostClose,
// };
const mapDispatch = dispatch => ({
  contactHostClose: () => dispatch(contactHostClose()),
  dispatch,
});
export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(ContactHost)));

