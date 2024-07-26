import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ruLocale from 'moment/locale/ru';
// Redux
import { connect } from 'react-redux';

// Translation
import { injectIntl } from 'react-intl';

import { DateRangePicker } from 'react-dates';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!sass-loader!react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

// Redux  Action
import { setPersonalizedValues } from '../../../actions/personalized';

// Locale
import messages from '../../../locale/messages';
import { isRTL } from '../../../helpers/formatLocale';

class MobileDateRange extends React.Component {
  static propTypes = {
    onChange: PropTypes.any,
    numberOfMonths: PropTypes.number,
    formatMessage: PropTypes.any,
    setPersonalizedValues: PropTypes.any,
    personalized: PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      startDate: null,
      endDate: null,
      smallDevice: false,
      verySmallDevice: false,
    };
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoad: false });
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  componentWillMount() {
    const { personalized } = this.props;

    if (personalized != undefined) {
      if (personalized.startDate && personalized.endDate) {
        this.setState({
          startDate: moment(personalized.startDate),
          endDate: moment(personalized.endDate),
        });
      }
    }
  }

  componentWillUnmount() {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize(e) {
    const isBrowser = typeof window !== 'undefined';
    const smallDevice = isBrowser ? window.matchMedia('(max-width: 767px)').matches : true;
    const verySmallDevice = isBrowser ? window.matchMedia('(max-width: 480px)').matches : false;

    this.setState({
      smallDevice,
      verySmallDevice,
    });
  }

  onDatesChange({ startDate, endDate }) {
    const { setPersonalizedValues } = this.props;
    this.setState({ startDate, endDate });
    if (startDate != null && endDate != null) {
      setPersonalizedValues({ name: 'startDate', value: moment(startDate).format('YYYY-MM-DD') });
      setPersonalizedValues({ name: 'endDate', value: moment(endDate).format('YYYY-MM-DD') });
    }
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { focusedInput, startDate, endDate, smallDevice, verySmallDevice } = this.state;
    const { numberOfMonths } = this.props;
    const { formatMessage } = this.props.intl;
    const daySize = (verySmallDevice) ? 35 : 60;
    const verticalHeight = (verySmallDevice) ? '70%' : '80%';
    const { locale } = this.props;
    moment.locale('ru', ruLocale);
    return (
      <div>
        <DateRangePicker
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          numberOfMonths={numberOfMonths}
          startDatePlaceholderText={formatMessage(messages.checkIn)}
          endDatePlaceholderText={formatMessage(messages.checkOut)}
          hideKeyboardShortcutsPanel
          readOnly
          verticalHeight={verticalHeight}
          daySize={daySize}
          transitionDuration={0}
          firstDayOfWeek={1}
          displayFormat={() => "DD.MM.YYYY"}
          anchorDirection={isRTL(locale) ? 'right' : 'left'}
          isRTL={isRTL(locale)}
        />
      </div>
    );
  }
}


const mapState = state => ({
  personalized: state.personalized,
  locale: state.intl.locale,
});

const mapDispatch = {
  setPersonalizedValues,
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(MobileDateRange)));

