import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';

class Status extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  };

  static defaultProps = {
    type: null,
    createdAt: null,
  };

  label(status) {
    switch (status) {
      case 'inquiry':
        // return 'Inquiry';
        return 'Запрос';
      case 'preApproved':
        // return 'Pre Approved';
        return 'Предварительно одобрено'
      case 'declined':
        return 'Отменено';
      case 'approved':
        return 'Одобрено';
      case 'pending':
        return 'Ожидается';
      case 'cancelledByHost':
        return 'Отменено хозяином';
      case 'cancelledByGuest':
        return 'Отменено гостем';
      case 'intantBooking':
        return 'Бронирование подтверждено';
      case 'confirmed':
        return 'Бронирование подтверждено';
      case 'expired':
        return 'Запрос истек';
      case 'requestToBook':
        return 'Запрос на бронирование';
      case 'completed':
        return 'Завершено';
    }
  }

  render() {
    const { type, createdAt } = this.props;
    const date = createdAt != null ? moment(createdAt).format('MM/D/YYYY') : '';
    return (
      <div className={cx(s.inlineStatus, s.space6)}>
        <div className={cx(s.horizontalText)}>
          <span className={s.textWrapper}>
            <span>{this.label(type)}</span>
            <span> {date}</span>
          </span>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Status);

