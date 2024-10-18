import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

// Translation
import { FormattedMessage, injectIntl } from 'react-intl';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DetailSearchForm.css';
import bt from '../../commonStyle.css';
import {
  Button,
  Grid,
  Row,
  Col,
  FormControl,
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';

// History
import history from '../../../core/history';

// Components
import DateRange from '../DateRange/DateRange';
import PlaceGeoSuggest from '../PlaceGeoSuggest/PlaceGeoSuggest';
import MobileDateRange from '../MobileDateRange/MobileDateRange';

// Internal Component
import CustomCheckbox from '../../CustomCheckbox';

// Redux Action
import { setPersonalizedValues } from '../../../actions/personalized';

// Helper
import detectMobileBrowsers from '../../../helpers/detectMobileBrowsers';

// Locale
import messages from '../../../locale/messages';
import { assertImportNamespaceSpecifier } from 'babel-types';

class DetailSearchForm extends React.Component {
  static propTypes = {
    setPersonalizedValues: PropTypes.any,
    personalized: PropTypes.shape({
      location: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
      distance: PropTypes.number,
      chosen: PropTypes.number,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      personCapacity: PropTypes.number,
      formatMessage: PropTypes.any,
      amenities: PropTypes.array,
    }),
    settingsData: PropTypes.shape({
      listSettings: PropTypes.array,
    }),
  };

  static defaultProps = {
    listingFields: [],
  };

  static defaultProps = {
    personalized: {
      location: null,
      lat: null,
      lng: null,
      distance: null,
      startDate: null,
      endDate: null,
      personCapacity: null,
      chosen: null,
      amenities: [],
    },
    settingsData: {
      listSettings: [],
    },
  };

  constructor(props) {
    super(props);
    this.moreFiltersRef = React.createRef();
    this.state = {
      mobileDevice: false,
      personCapacity: [],
      isLoad: false,
      smallDevice: false,
      verySmallDevice: false,
    },
      this.handleClick = this.handleClick.bind(this);
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
    const { listingFields } = this.props;

    this.setState({ isLoad: true });
    if (detectMobileBrowsers.isMobile() === true) {
      this.setState({ mobileDevice: true });
    }
    if (listingFields != undefined) {
      this.setState({
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity,
      });
    }
  }

  componentWillUnmount() {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { listingFields } = nextProps;
    if (listingFields != undefined) {
      this.setState({
        roomType: listingFields.roomType,
        personCapacity: listingFields.personCapacity,
      });
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

  handleClick() {
    const { personalized, setPersonalizedValues } = this.props;
    let updatedURI,
      uri = '/s?';

    if (personalized.chosen != null) {
      uri = `${uri}&address=${personalized.location}&chosen=${personalized.chosen}`;
    } else if (personalized.location != null) {
      uri = `${uri}&address=${personalized.location}`;
    }

    if (personalized.startDate != null && personalized.endDate != null) {
      uri = `${uri}&startdate=${personalized.startDate}&enddate=${personalized.endDate}`;
    }

    if (personalized.personCapacity != null && !isNaN(personalized.personCapacity)) {
      uri = `${uri}&guests=${personalized.personCapacity}`;
    }

    if (personalized.amenities && personalized.amenities.length > 0) {
      uri = `${uri}&amenities=${personalized.amenities.join(',')}`;
    }

    if (personalized.distance != null && !isNaN(personalized.distance)) {
      uri = `${uri}&distance=${personalized.distance}`;
    }

    updatedURI = encodeURI(uri);
    history.push(updatedURI);
  }


  renderFormControl = ({ input, label, type, meta: { touched, error }, className }) => {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        {touched && error && <span className={s.errorMessage}>{formatMessage(error)}</span>}
        <FormControl {...input} placeholder={label} type={type} className={className} />
      </div>
    );
  }

  checkboxGroup = ({ label, name, options, input, isOpen }) => {
    let count = 4,
      firstArray = [],
      restArray = [];
    const itemList = options && options.length > 0 ? options.filter(o => o.isEnable == '1') : [];
    if (itemList && itemList.length > 0) {
      firstArray = itemList.slice(0, count);
      restArray = itemList.slice(count, itemList.length);
    }

    return (
      <div className={cx(s.checkboxGrid)}>
        {
          firstArray.map((option, index) => (
            <label className={cx(s.checkboxLabel)}>
              <CustomCheckbox
                className={'icheckbox_square-green'}
                name={`${input.name}[${index}]`}
                value={option.id}
                checked={input.value.indexOf(option.id) !== -1}
                onChange={(event) => {
                  const newValue = [...input.value];
                  if (event === true) {
                    newValue.push(option.id);
                  } else {
                    newValue.splice(newValue.indexOf(option.id), 1);
                  }
                  return input.onChange(newValue);
                }}
              />
              {option.itemName}
            </label>
            ))
        }
      </div>
    );
  };

  render() {
    const { location, dates, settingsData, setPersonalizedValues, personalized, listingFields } = this.props;
    const { isLoad, smallDevice, verySmallDevice } = this.state;
    const { formatMessage } = this.props.intl;
    const { personCapacity } = this.state;
    const rows = []; const isBrowser = typeof window !== 'undefined';

    let startValue,
      endValue;
    if (personCapacity && personCapacity[0] && personCapacity[0].startValue) {
      for (let i = personCapacity[0].startValue; i <= personCapacity[0].endValue; i++) {
        rows.push(<option value={i} key={i}>{i} {i > 1 ? formatMessage(messages.guests) : formatMessage(messages.guest)}</option>);
        startValue = personCapacity[0].startValue;
        endValue = personCapacity[0].endValue;
      }
    }
    // const smallDevice = isBrowser ? window.matchMedia('(max-width: 640px)').matches : undefined;

    return (
      <Grid fluid>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} className={s.noPadding}>
            <form>
              <div className={cx(s.searchFormInputs, 'homeSearchForm vidSearchForm')}>
                <div className={s.searchForm}>
                  <div className={cx(s.table)}>
                    <div className={cx(s.tableRow)}>
                      <div className={cx(s.tableCell, s.location)}>
                        <label className={s.label}>
                          <span> <FormattedMessage {...messages.where} /></span>
                        </label>
                        <label className={s.searchElement} aria-label="Location input">
                          {
                            !isLoad && <PlaceGeoSuggest
                            id="suggest"
                              label={formatMessage(messages.homeWhere)}
                              className={cx(s.input)}
                              containerClassName={s.geoSuggestContainer}
                            />
                          }
                          {
                            isLoad && <Field
                              component={this.renderFormControl}
                              label={formatMessage(messages.homeWhere)}
                              className={cx(s.input, s.loadfield)}
                              name="location"
                            />
                          }
                        </label>
                      </div>
                      <div className={cx(s.tableCell, s.dates)}>
                        <label className={s.label}>
                          <span> <FormattedMessage {...messages.when} /></span>
                        </label>
                        <span className={cx('homeDate vidFormsearch', s.input)}>
                          {
                            !smallDevice && <DateRange
                              formName={'SearchForm'}
                              numberOfMonths={2}
                            />
                          }
                          {
                            smallDevice && <MobileDateRange
                              formName={'SearchForm'}
                              numberOfMonths={1}
                              smallDevice
                              verySmallDevice
                            />
                          }
                        </span>
                      </div>
                      <div className={cx(s.tableCell, s.guests, s.mobilePadding)}>
                        <label className={cx(s.selectPadding, s.label)}>
                          <span> <FormattedMessage {...messages.guest} /></span>
                        </label>
                        <FormControl
                          componentClass="select"
                          className={cx(s.formControlSelect, s.input, s.inputPadding, s.selectBorder, 'selectNew', bt.commonControlSelect)}
                          onChange={e => setPersonalizedValues({ name: 'personCapacity', value: Number(e.target.value) })}
                          defaultValue={personalized.personCapacity}
                        >
                          {rows}
                        </FormControl>
                      </div>
                      {/*
                      <a className={cx(s.tableCell)} href="javascript:void(0);" onClick={() => { if (this.moreFiltersRef.current) this.moreFiltersRef.current.parentNode.scrollTop = this.moreFiltersRef.current.offsetTop }}>Еще фильтры</a>
                      <div ref={this.moreFiltersRef} className={cx(s.tableCell, s.dates)}>
                        <label className={cx(s.selectPadding, s.label)}>
                          <span> <FormattedMessage {...messages.aminities} /></span>
                        </label>
                        <Field
                          name="amenities"
                          component={this.checkboxGroup}
                          options={listingFields.essentialsAmenities}
                          defaultValue={personalized.amenities}
                          onChange={(e) => setPersonalizedValues({ name: 'amenities', value: Object.values(e).filter(x => x > 0) })}
                        />
                      </div>
                      <div className={cx(s.tableCell, s.distance, s.mobilePadding)}>
                        <label className={cx(s.selectPadding, s.label)}>
                          <span> <FormattedMessage {...messages.distance} />: {personalized.distance}</span>
                        </label>
                        <input className={cx(s.distance)} type="range" min="0" max="40000" value={personalized.distance} onChange={(e) => setPersonalizedValues({ name: 'distance', value: Number(e.target.value) })} />
                      </div>
                      */}
                    </div>
                    <div className={cx(s.search, 'searchRTL')}>
                      {/*added height for button */}
                      <Button className={cx(bt.btnPrimary, s.btnBlock)} onClick={this.handleClick} style={{height:"2rem"}}>
                        <span className={cx('hidden-lg hidden-xs')}><FontAwesome.FaSearch /></span>
                        <span className={cx('hidden-md hidden-sm')}>
                          <FormattedMessage {...messages.search} />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}
DetailSearchForm = reduxForm({
  form: 'DetailSearchForm', // a unique name for this form
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(DetailSearchForm);

const mapState = state => ({
  personalized: state.personalized,
  settingsData: state.viewListing.settingsData,
  listingFields: state.listingFields.data,
});

const mapDispatch = {
  setPersonalizedValues,
};

export default injectIntl(withStyles(s, bt)(connect(mapState, mapDispatch)(DetailSearchForm)));
