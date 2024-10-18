import {
    OPEN_BOOKING_MODAL,
    CLOSE_BOOKING_MODAL,
} from '../../constants';

export function openBookingModal() {
  return async (dispatch) => {
    console.log('start open modal 1');
    dispatch({
      type: OPEN_BOOKING_MODAL,
      payload: {
        bookingModal: true,
      },
    });
    return true;
  };
}

export function closeBookingModal() {
  return async (dispatch) => {
    console.log('end open modal 1');
    dispatch({
      type: CLOSE_BOOKING_MODAL,
      payload: {
        bookingModal: false,
      },
    });
    return true;
  };
}
