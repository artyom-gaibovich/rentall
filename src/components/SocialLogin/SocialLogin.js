import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Image,
} from 'react-bootstrap';

import cx from 'classnames';
import s from './SocialLogin.css';
import { FormattedMessage } from 'react-intl';

// Locale
import messages from '../../locale/messages';
import googleIcon from './googleIcon.png';

class SocialLogin extends Component {
  static propTypes = {
    formatMessage: PropTypes.any,
    refer: PropTypes.string,
  };

  render() {
    const { refer } = this.props;
    let FbURL = '/login/facebook';
    let GoogleURL = '/login/google';
    let YandexURL = '/login/yandex';
    let VkURL = '/login/vk';
    let OdnoklassnikiURL = '/login/odnoklassniki';
    if (refer) {
      FbURL = `/login/facebook?refer=${refer}`;
      GoogleURL = `/login/google?refer=${refer}`;
      YandexURL = `/login/yandex?refer=${refer}`;
      VkURL = `/login/vk?refer=${refer}`;
      OdnoklassnikiURL = `/login/odnoklassniki?refer=${refer}`;
    }

    return (
      <div>
        {/* Yandex */}
        <div className={s.formGroup}>
          <a className={cx(s.yandex, s.button)} href={YandexURL}>
            <svg
              className={cx(s.icon, 'floatRight')}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
             <path d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z" fill="#FC3F1D"/><path d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z" fill="#fff"/>
            </svg>
            <p>Регистрация c Yandex</p>
          </a>
        </div>

        {/* Vk */}
        <div className={s.formGroup}>
          <a className={cx(s.yandex, s.button)} href={VkURL}>
            <svg
              className={cx(s.icon, 'floatRight')}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
            <path class="st0" d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"/>
            </svg>
            <p>Регистрация c VK</p>
          </a>
        </div>
        
        {/* Odnoklassniki */}
        {/* <div className={s.formGroup}>
          <a className={cx(s.yandex, s.button)} href={OdnoklassnikiURL}>
            <svg
              className={cx(s.icon, 'floatRight')}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
             <path d="M2.04 12c0-5.523 4.476-10 10-10 5.522 0 10 4.477 10 10s-4.478 10-10 10c-5.524 0-10-4.477-10-10z" fill="#FC3F1D"/><path d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.487H7.49l2.695-4.014c-1.55-1.111-2.42-2.19-2.42-4.015 0-2.288 1.595-3.85 4.62-3.85h3.003v11.868H13.32V7.666z" fill="#fff"/>
            </svg> 
          <FormattedMessage {...messages.odnoklassnikiLogin} />
          </a>
        </div> */}
        {/*
        <div className={s.formGroup}>
          <a className={cx(s.facebook, s.button)} href={FbURL}>
            <svg
              className={cx(s.icon, 'floatRight')}
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z"
              />
            </svg>
            <FormattedMessage {...messages.facebookLogin} />
          </a>
        </div>
        */}
        {/*
        <div className={s.formGroup}>
          <a className={cx(s.google, s.button)} href={GoogleURL}>
            <div className={cx(s.googleIcon, 'floatRight')}>
              <Image src={googleIcon} responsive />
            </div>
            <FormattedMessage {...messages.googleLogin} />
          </a>
        </div>
        */}
      </div>
    );
  }
}

export default withStyles(s)(SocialLogin);
