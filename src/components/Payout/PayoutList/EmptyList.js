import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  Panel,
} from 'react-bootstrap';

import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EmptyList.css';
import bt from '../../../components/commonStyle.css';

// Redirection
import Link from '../../Link';

// Locale
import messages from '../../../locale/messages';

class EmptyList extends Component {
  static propTypes = {
    siteName: PropTypes.string.isRequired,
    formatMessage: PropTypes.any,
  };

  handleClick() {
    history.push('/user/addpayout');
  }

  render() {
    const { siteName, yookassaConnect } = this.props;
    const { formatMessage } = this.props.intl;

    
    const YookassaRemoveConnection = async () => {
      const query = `query (
        $userId: String!,
      ){
        YookassaRemoveConnection (
          userId: $userId,
        ) {
          userId
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
         variables: {
          userId: 'test string'
         },
       }),
       credentials: 'include',
     });
     const { data } = await resp.json();
     location.reload();
     return data;
     // let response = graphql
   }
    // console.log(this.props);
    return (
      <div className={'commonListingBg'}>
        <Panel className={cx(s.panelHeader)}>
          <div>
            <h3 className={bt.listingTitleText}>{formatMessage(messages.payoutMethod)}</h3>
          </div>
          <div className={cx(s.spaceTop3, s.textCenter)}>
            <span className={s.textTitle}><FormattedMessage {...messages.addPayoutMethod} /></span>
          </div>
          <div className={s.textCenter}>
            <span className={s.textLead}>{siteName} <FormattedMessage {...messages.paymentReleaseInfo1} /></span><br />
            <span className={s.textLead}><FormattedMessage {...messages.paymentReleaseInfo2} /></span>
          </div>
          <div className={cx(s.spaceTop4, s.space2, s.textCenter)}>
            {!yookassaConnect ?
              <a href={'login/yookassa'} className={cx(bt.btnPrimary)}><FormattedMessage {...messages.addPayout} /></a>
              : <button className={cx(bt.btnPrimary)} onClick={() => YookassaRemoveConnection()}>Отключить ЮКассу</button>//<span style={{color: "#008400"}}>ЮKassa подключена</span>
            }
          </div>
          <a href="/Подключение_платежной_системы_инструкция_(1).pdf" target="_blank" className={s.showInstruction}>Показать инструкцию</a>
        </Panel>
      </div>
    );
  }
}

const mapState = state => ({
  siteName: state.siteSettings.data.siteName,
});
const mapDispatch = {};

export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(EmptyList)));
