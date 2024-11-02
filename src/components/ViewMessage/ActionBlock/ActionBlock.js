import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ViewMessage.css';

// Component
import GuestActions from './GuestActions';
import HostActions from './HostActions';

class ActionBlock extends Component {
  static propTypes = {
    threadType: PropTypes.string.isRequired,
    actionType: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    threadId: PropTypes.number.isRequired,
    listId: PropTypes.number.isRequired,
    reservationId: PropTypes.number,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    personCapacity: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    hostDisplayName: PropTypes.string.isRequired,
    guestDisplayName: PropTypes.string.isRequired,
    prePayment: PropTypes.number,
    totalPayment: PropTypes.number,

  };

  static defaultProps = {
    actionType: null,
  }

  render() {
    const { threadType, actionType, status, threadId, listId, startDate, endDate, personCapacity, createdAt } = this.props;
    const { hostDisplayName, guestDisplayName, reservationId, guestEmail, title, listPublishStatus, prePayment, totalPayment } = this.props;

    console.log('actionType', actionType);
    console.log('threadType', threadType);

    if (actionType != null) {
      if (threadType === 'host') {
        return (<HostActions
          actionType={actionType}
          threadId={threadId}
          reservationId={reservationId}
          threadType={threadType}
          startDate={startDate}
          endDate={endDate}
          personCapacity={personCapacity}
          createdAt={createdAt}
          guestDisplayName={guestDisplayName}
          hostDisplayName={hostDisplayName}
          guestEmail={guestEmail}
          title={title}
          listPublishStatus={listPublishStatus}
        />);
      }
      return (<GuestActions
        actionType={actionType}
        threadId={threadId}
        listId={listId}
        startDate={startDate}
        endDate={endDate}
        personCapacity={personCapacity}
        reservationId={reservationId}
        hostDisplayName={hostDisplayName}
        createdAt={createdAt}
        listPublishStatus={listPublishStatus}
        prePayment={prePayment}
        totalPayment={totalPayment}
      />);
    }
    return <div />;
  }
}

export default withStyles(s)(ActionBlock);

