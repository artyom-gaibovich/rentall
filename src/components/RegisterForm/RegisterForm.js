import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field, reduxForm } from 'redux-form';
import submit from './submit';
import validate from './validate';
import { FormattedMessage, injectIntl } from 'react-intl';
import InputMask from 'react-input-mask';
import validator from 'validator';
// Locale
import messages from '../../locale/messages';

// Helper
import PopulateData from '../../helpers/populateData';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './RegisterForm.css';
import bt from '../../components/commonStyle.css';
import {
  Button,
  Row,
  FormGroup,
  Col,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

class RegisterForm extends Component {

  static propTypes = {
    formatMessage: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      dateOfBirthData: {},
    };
  }

  componentWillMount() {
    
    this.setState({
      isChanged: {
        phoneNumber: false,
        lastName: false,
        firstName: false,
        phoneNumber: false,
        email: false
      },
      lastName: '',
      firstName: '',
      phoneNumber: '',
      email: ''
    });
  }

  renderFormControl = ({ input, label, type, onChange, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <FormControl {...input} placeholder={label} onChange={onChange} type={type} className={className} />
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
      </div>
    );
  }

  renderFormControlSelect = ({ input, label, meta: { touched, error }, children, className }) => (
    <div>
      <FormControl componentClass="select" {...input} className={className}>
        {children}
      </FormControl>
    </div>
    )
  
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
        // console.log('handle change', this.state)
        
    })
  }

  render() {
    const { error, handleSubmit, submitting, dispatch } = this.props;
    const { formatMessage } = this.props.intl;
  

    return (
      <form className="SelectFocus">
        {error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormGroup className={s.formGroup}>
        <input
        style={{width: '100%'}}
            placeholder='Ваше имя'
             onChange={e =>  this.handleChange(e, 'firstName')}
             className={cx(s.formControlInput, s.backgroundTwo, bt.commonControlInput)} />
          <span className={bt.errorHelper}>{ !this.state.firstName && this.state.isChanged.firstName ? 'Поле обязательно для заполнения' : '' }</span>
        
        </FormGroup>
        <FormGroup className={s.formGroup}>
          
          <input
          style={{width: '100%'}}
            placeholder='Вашa фамилия'
             onChange={e =>  this.handleChange(e, 'lastName')}
             className={cx(s.formControlInput, s.backgroundTwo, bt.commonControlInput)}/>
          <span className={bt.errorHelper}>{ !this.state.lastName && this.state.isChanged.lastName ? 'Поле обязательно для заполнения' : '' }</span>
        
        </FormGroup>
        <FormGroup className={s.formGroup}>
            <input style={{width: '100%'}} placeholder='Ваш email' onChange={e =>  this.handleChange(e, 'email')} type="email" className={cx(s.formControlInput, s.backgroundOne, bt.commonControlInput)} />
            <span className={bt.errorHelper}>{!validator.isEmail(this.state.email) && this.state.isChanged.email ? 'Поле должно содержать email' : '' }</span>
        </FormGroup>
        <FormGroup className={s.formGroup}>
            <InputMask
              mask="+7(999)999-99-99"
              onChange={e =>  this.handleChange(e, 'phoneNumber')}
              style={{width: '100%'}}
            >
              {(props) => <input placeholder='+7(000)000-00-00' className={cx(s.formControlInput, s.backgroundOne, bt.commonControlInput)} name="phoneNumber" {...props} />}
            </InputMask>
            <span className={bt.errorHelper}>{!validator.isMobilePhone(this.state.phoneNumber.replace(/\D/g, '')) && this.state.isChanged.phoneNumber ? 'Укажите номер вашего телефона': '' }</span>

        </FormGroup>
        <FormGroup className={s.formGroup}>
        <input
            placeholder='Ваш пароль'
            type='password'
            style={{width: '100%'}}
            onChange={e =>  this.handleChange(e, 'password')}
            className={cx(s.formControlInput, s.backgroundTwo, bt.commonControlInput)}></input>
          <span className={bt.errorHelper}>{ !this.state.password && this.state.isChanged.password ? 'Поле обязательно для заполнения' : '' }</span>
        
        </FormGroup>

        
        <FormGroup className={s.formGroup}>
          <Button
            className={cx(bt.btnPrimary, bt.btnBig)}
            block
            onClick={() => submit(this.state, dispatch)}
            disabled={ !this.state.phoneNumber || 
              !this.state.email || 
              !validator.isEmail(this.state.email) || 
              !validator.isMobilePhone(this.state.phoneNumber.replace(/\D/g, '')) || 
              !this.state.firstName || 
              !this.state.lastName ||
              !this.state.password
            }
          >
            {formatMessage(messages.signUp)}
          </Button>
        </FormGroup>
      </form>
    );
  }
}

RegisterForm = reduxForm({
  form: 'RegisterForm', // a unique name for this form
  validate,
})(RegisterForm);

export default injectIntl(withStyles(s, bt)(RegisterForm));
