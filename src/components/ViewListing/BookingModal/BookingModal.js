// General
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './BookingModal.css';
import {
    Modal,
} from 'react-bootstrap';

// Redux
import { connect } from 'react-redux';
import { closeBookingModal } from '../../../actions/BookingModal/modalActions';

import Calendar from '../Calendar';


class BookingModal extends Component {
  static propTypes = {
    closeLoginModal: PropTypes.func,
    loginModal: PropTypes.bool,
    openSignupModal: PropTypes.func,
    formatMessage: PropTypes.func,
    onClose: PropTypes.func,
    openModal: PropTypes.bool 
  };

  static defaultProps = {
    loading: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      bookingModalStatus: false,
    };
  }

  componentDidMount() {
    const { bookingModal } = this.props;
    if (bookingModal === true) {
      this.setState({ bookingModalStatus: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { bookingModal } = nextProps;
    console.log({bookingModal})
    if (bookingModal === true) {
      this.setState({ bookingModalStatus: true });
    } else {
      this.setState({ bookingModalStatus: false });
    }
  }

  render() {
    const { closeBookingModal } = this.props;
    const { bookingModalStatus } = this.state;
    const { id, loading, blockedDates, personCapacity, country } = this.props;
    const { listingData, isHost, bookingType, reviewsCount, reviewsStarRating } = this.props;

    return (
      <div>
        <Modal show={this.props.openModal} animation={false} onHide={() => this.props.onClose()} dialogClassName={cx(s.logInModalContainer, 'BookingModalNew', 'viewListModal')} >
          <Modal.Header closeButton />
          <Modal.Body bsClass={s.logInModalBody}>
            <Calendar
              id={id}
              loading={loading}
              blockedDates={blockedDates || undefined}
              personCapacity={personCapacity}
              listingData={listingData || undefined}
              isHost={isHost}
              bookingType={bookingType}
              reviewsCount={reviewsCount}
              reviewsStarRating={reviewsStarRating}
              country={country}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}


const mapState = state => {
  console.log({state});
  return {
    bookingModal: state.modalStatus.bookingModal,
  }
};

const mapDispatch = {
  closeBookingModal,
};

export default withStyles(s)(connect(mapState, mapDispatch)(BookingModal));
