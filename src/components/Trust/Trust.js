import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';


import { Panel } from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Trust.css';
import bt from '../../components/commonStyle.css';
import history from '../../core/history';

// Component
import Item from './Item';

// Redux
import { connect } from 'react-redux';
import { disconnectVerification, resendEmailVerification } from '../../actions/manageUserVerification';

// Locale
import messages from '../../locale/messages';

class MenuComponent extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      isEmailConfirmed: PropTypes.bool,
      isFacebookConnected: PropTypes.bool,
      isVkConnected: PropTypes.bool,
      isOdnoklassnikiConnected: PropTypes.bool,
      isYandexConnected: PropTypes.bool,
      isGoogleConnected: PropTypes.bool,
      isIdVerification: PropTypes.bool,
    }),
    disconnectVerification: PropTypes.any.isRequired,
    account: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
    resendEmailLoading: PropTypes.bool,
    formatMessage: PropTypes.any,
  };

  static defaultProps = {
    data: {
      isEmailConfirmed: false,
      isFacebookConnected: false,
      isVkConnected: false,
      isOdnoklassnikiConnected: false,
      isYandexConnected: false,
      isGoogleConnected: false,
      isIdVerification: false,
    },
    resendEmailLoading: false,
  }

  constructor(props) {
    super(props);
    this.sendConfirmEmail = this.sendConfirmEmail.bind(this);
    this.facebookDisconnect = this.facebookDisconnect.bind(this);
    this.vkDisconnect = this.vkDisconnect.bind(this);
    this.odnoklassnikiDisconnect = this.vkDisconnect.bind(this);
    this.yandexDisconnect = this.yandexDisconnect.bind(this);
    this.googleDisconnect = this.googleDisconnect.bind(this);
    this.documentVerification = this.documentVerification.bind(this);
  }

  sendConfirmEmail() {
    const { resendEmailVerification } = this.props;
    resendEmailVerification();
  }

  facebookDisconnect() {
    const { disconnectVerification, account } = this.props;
    disconnectVerification('facebook', account.userId);
  }

  vkDisconnect() {
    const { disconnectVerification, account } = this.props;
    disconnectVerification('vk', account.userId);
  }

  odnoklassnikiDisconnect() {
    const { disconnectVerification, account } = this.props;
    disconnectVerification('odnoklassniki', account.userId);
  }

  yandexDisconnect() {
    const { disconnectVerification, account } = this.props;
    disconnectVerification('yandex', account.userId);
  }

  googleDisconnect() {
    const { disconnectVerification, account } = this.props;
    disconnectVerification('google', account.userId);
  }

  documentVerification() {
    history.push('/document-verification');
  }

  render() {
    const { data: { isEmailConfirmed, isFacebookConnected, isOdnoklassnikiConnected, isVkConnected, isYandexConnected, isGoogleConnected, isIdVerification }, resendEmailLoading } = this.props;
    const { formatMessage } = this.props.intl;
    const displayVerifiedPanel = isEmailConfirmed || isFacebookConnected || isVkConnected || isOdnoklassnikiConnected || isYandexConnected || isGoogleConnected || isIdVerification || false;
    const displayUnVerifiedPanel = !isEmailConfirmed || !isFacebookConnected || !isVkConnected || !isOdnoklassnikiConnected || !isYandexConnected || !isGoogleConnected || !isIdVerification || false;

    return (
      <div className={cx('commonListingBg', 'trustNoPadding')}>
        {
          displayVerifiedPanel && <Panel className={cx(s.panelHeader, s.space3)}>
            <div>
              <h3 className={bt.listingTitleText}>{formatMessage(messages.verifiedInfo)}</h3>
            </div>
            <ul className={cx(s.listLayout, 'listLayoutArbic')}>
              {
                isEmailConfirmed && <Item
                  title={formatMessage(messages.email)}
                  content={formatMessage(messages.verifiedEmail)}
                  isAction={false}
                  isImage
                  name="email"
                />
              }

              {/*
                isFacebookConnected && <Item
                  title={formatMessage(messages.facebook)}
                  content={formatMessage(messages.facebookInfo)}
                  isAction
                  isLink={false}
                  buttonLabel={formatMessage(messages.disconnect)}
                  handleClick={this.facebookDisconnect}
                  name='facebook'
                />
              */}
              {
                isYandexConnected && <Item
                  title={formatMessage(messages.yandex)}
                  content={formatMessage(messages.yandexInfo)}
                  isAction
                  isLink={false}
                  buttonLabel={formatMessage(messages.disconnect)}
                  handleClick={this.yandexDisconnect}
                  name='yandex'
                />
              }
              {/* {
                isOdnoklassnikiConnected && <Item
                  title={formatMessage(messages.odnoklassniki)}
                  content={formatMessage(messages.odnoklassnikiInfo)}
                  isAction
                  isLink={false}
                  buttonLabel={formatMessage(messages.disconnect)}
                  handleClick={this.yandexDisconnect}
                  name='dnoklassniki'
                />
              } */}

              {
                isVkConnected && <Item
                  title={formatMessage(messages.vk)}
                  content={formatMessage(messages.vkInfo)}
                  isAction
                  isLink={false}
                  buttonLabel={formatMessage(messages.disconnect)}
                  handleClick={this.vkDisconnect}
                  name='vk'
                />
              }
              {       
                isGoogleConnected && <Item
                  title={formatMessage(messages.google)}
                  content={formatMessage(messages.googleInfo)}
                  isAction
                  isLink={false}
                  buttonLabel={formatMessage(messages.disconnect)}
                  handleClick={this.googleDisconnect}
                  name="google"
                />
              }

              {
                isIdVerification && <Item
                  title={formatMessage(messages.verificationdocument)}
                  content={formatMessage(messages.documentverificaitonDetails)}
                  isImage
                  name="document"
                />
              }

              {
                !isEmailConfirmed && !isFacebookConnected && !isYandexConnected && !isVkConnected && !isOdnoklassnikiConnected && !isGoogleConnected && !isIdVerification &&
                <p><FormattedMessage {...messages.notVerifiedDetails} /></p>
              }
            </ul>
          </Panel>
        }


        {
          displayUnVerifiedPanel && <Panel className={s.panelHeader}>
            <div>
              <h3 className={bt.listingTitleText}>{formatMessage(messages.notVerifiedInfo)}</h3>
            </div>
            <ul className={cx(s.listLayout, 'listLayoutArbic')}>
              {
                !isEmailConfirmed && <Item
                  title={formatMessage(messages.email)}
                  content={formatMessage(messages.pleaseVerify)}
                  isAction
                  isLink={false}
                  buttonLabel={formatMessage(messages.verifyEmail)}
                  handleClick={this.sendConfirmEmail}
                  show={resendEmailLoading}
                  name="email"
                />
              }

              {/*
                !isFacebookConnected && <Item
                  title={formatMessage(messages.facebook)}
                  content={formatMessage(messages.facebookInfo)}
                  isAction
                  isLink
                  buttonLabel={formatMessage(messages.connect)}
                  url={"/login/facebook"}
                  name='facebook'
                />
              */}

              {
                !isYandexConnected && <Item
                  title={formatMessage(messages.yandex)}
                  content={formatMessage(messages.yandexInfo)}
                  isAction
                  isLink
                  buttonLabel={formatMessage(messages.connect)}
                  url={"/login/yandex"}
                  name='yandex'
                />
              }
              {/* {
                !isOdnoklassnikiConnected && <Item
                  title={formatMessage(messages.odnoklassniki)}
                  content={formatMessage(messages.odnoklassnikiInfo)}
                  isAction
                  isLink
                  buttonLabel={formatMessage(messages.connect)}
                  url={"/login/odnoklassniki"}
                  name='odnoklassniki'
                />
              } */}

              {
                !isVkConnected && <Item
                  title={formatMessage(messages.vk)}
                  content={formatMessage(messages.vkInfo)}
                  isAction
                  isLink
                  buttonLabel={formatMessage(messages.connect)}
                  url={"/login/vk"}
                  name='vk'
                />
              }

              {
                !isGoogleConnected && <Item
                  title={formatMessage(messages.google)}
                  content={formatMessage(messages.googleInfo)}
                  isAction
                  isLink
                  buttonLabel={formatMessage(messages.connect)}
                  url={'/login/google'}
                  name="google"
                />
              }
              {
                !isIdVerification && <Item
                  title={formatMessage(messages.documentverificaiton)}
                  content={formatMessage(messages.documentVerificaitonInfo)}
                  isAction
                  buttonLabel={formatMessage(messages.documentverificaiton)}
                  handleClick={this.documentVerification}
                  name="document"
                />
              }
            </ul>
          </Panel>
        }
      </div>
    );
  }
}

const mapState = state => ({
  resendEmailLoading: state.loader.resendEmailLoading,
  account: state.account.data,
});

const mapDispatch = {
  disconnectVerification,
  resendEmailVerification,
};

export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(MenuComponent)));
