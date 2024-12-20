
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reset, change, submit as submitForm, formValueSelector, getFormValues, reduxForm } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchHeader.css';
import cx from 'classnames';
// Locale
import messages from '../../../locale/messages';
import { connect } from 'react-redux';

// Components
import Dates from '../Filters/Dates';
import Guests from '../Filters/Guests';
import HomeType from '../Filters/HomeType';
import Price from '../Filters/Price';
import Facilities from '../Filters/Facilities/Facilities';
import Eat from '../Filters/Eat/Eat';
import Help from '../Filters/Help/Help';
import Rent from '../Filters/Rent/Rent';
import InstantBook from '../Filters/InstantBook';
import MoreFilters from '../Filters/MoreFilters';
import ShowMap from '../Filters/ShowMap';
import MoreFiltersModal from '../../MoreFiltersModal';
import { openMoreFiltersModal } from '../../../actions/modalActions';
import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { Search } from "../../../routes/search/Search.js"
import submit from '../SearchForm/submit';
import {getValuesFilterDelete} from '../SearchForm/submit';

class SearchHeader extends Component {
  static propTypes = {
    mapBounds: PropTypes.array,
    isResultLoading: PropTypes.bool,
    initialFilter: PropTypes.object
  };

  static defaultProps = {
    isResultLoading: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      tabs: {
        dates: false,
        guests: false,
        homeType: false,
        price: false,
        instantBook: false,
        facilities: false,
        eat: false,
        help: false,
        rent: false,
        moreFilters: false,
      },
      overlay: false,
      smallDevice: false,
      verySmallDevice: false,
      page: 1,
      ne_lat: 0,
      ne_lng: 0,
      sw_lat: 0,
      sw_lng: 0,
    };

    this.handleTabToggle = this.handleTabToggle.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  async handleSubmit() {
    const { change, submitForm } = this.props;

    // Обновление значений формы координатами карты
    await change('currentPage', 1);
    await change('sw_lat', this.state.sw_lat);
    await change('sw_lng', this.state.sw_lng);
    await change('ne_lat', this.state.ne_lat);
    await change('ne_lng', this.state.ne_lng);

    // Отправка формы с обновлёнными данными
    await submitForm('SearchForm');
}

  async refreshYmaps() {
    const waitForLoadingComplete = () => {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.props.isResultLoading) {
            resolve(); // Завершаем ожидание, если загрузка завершена
          } else {
            setTimeout(checkLoading, 100); // Проверяем снова через 100 мс
          }
        };
        checkLoading();
      });
    };

    // Ожидаем завершения загрузки
    await waitForLoadingComplete();

    // После завершения загрузки очищаем и инициализируем карту
    // await Search.clearMapInstance();
    await Search.reloadYmaps();
  }

  componentDidMount() {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }
  }

  componentWillUnmount() {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  handleResize(e) {
    const { tabs } = this.state;
    const isBrowser = typeof window !== 'undefined';
    const smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : true;
    const verySmallDevice = isBrowser ? window.matchMedia('(max-width: 480px)').matches : false;

    for (const key in tabs) {
      tabs[key] = false;
    }

    this.setState({ smallDevice, verySmallDevice, tabs, overlay: false });
  }

  async handleTabToggle(currentTab, isExpand, refresh) {
    const { showForm, showResults, showFilter } = this.props;
    const { tabs, smallDevice } = this.state;
    
    for (const key in tabs) {
      if (key == currentTab) {
        tabs[key] = isExpand;

      } else {
        tabs[key] = false;
      }
    }
    
    this.setState({
      tabs,
      overlay: isExpand,
    });
    
    // if (smallDevice) {
    //   if (isExpand) {
    //     showFilter();
    //   } else {
    //     showResults();
    //   }
    // }

    if (refresh) {
      await this.refreshYmaps();
    }
  }

  handleOpen() {
    const { openMoreFiltersModal } = this.props;
    openMoreFiltersModal();
  }

  render() {
    const { searchSettings, formValues, mapBounds } = this.props;
    const { tabs, overlay, smallDevice, verySmallDevice } = this.state;
    let isActive = false;

    if (formValues && (formValues.beds || formValues.bedrooms || formValues.bathrooms
      || (formValues.amenities && formValues.amenities.length) || (formValues.spaces && formValues.spaces.length)
      || (formValues.houseRules && formValues.houseRules.length)
      || (formValues.fish && formValues.fish.length)
      || (formValues.safetyAmenities && formValues.safetyAmenities.length) || (formValues.roomType && formValues.roomType.length && smallDevice) || (formValues.priceRange && formValues.priceRange.length && smallDevice))) {
      isActive = true;
    }
    return (
      <div>
        <div className={cx(s.searchHeaderContainerBox, { [s.fullResponsiveContainer]: (tabs.dates == true || tabs.guests == true || tabs.moreFilters == true) })}>
          <div className={cx(s.searchHeaderContainer, s.responsiveNoPadding)}>
            <div className={cx(s.searchHeaderResponsiveScroll, 'searchHeaderScroll')}>
              <div className={s.searchHeaderResponsive}>
                {/*<h1 className={s.search__title}>Рыбалка и отдых</h1>*/}

                <Dates
                  className={s.filterButtonContainer}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.dates}
                  smallDevice={smallDevice}
                  verySmallDevice={verySmallDevice}
                />
                <Guests
                  className={s.filterButtonContainer}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.guests}
                  smallDevice={smallDevice}
                />
                <Price
                  className={cx(s.filterButtonContainer, 'hidden-xs', s.hideTabletSection)}
                  handleTabToggle={this.handleTabToggle}
                  searchSettings={searchSettings}
                  isExpand={tabs.price}
                />
                <HomeType
                  className={cx(s.filterButtonContainer, 'hidden-xs', s.hideTabletSection)}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.homeType}
                />
                <Facilities
                  className={cx(s.filterButtonContainer)}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.facilities}
                  smallDevice={smallDevice}
                />
                <Eat
                  className={cx(s.filterButtonContainer)}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.eat}
                  smallDevice={smallDevice}
                />
                <Help
                  className={cx(s.filterButtonContainer)}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.help}
                  smallDevice={smallDevice}
                />
                <Rent
                  className={cx(s.filterButtonContainer)}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.rent}
                  smallDevice={smallDevice}
                />                
                {/*
                <InstantBook
                  className={cx(s.filterButtonContainer, 'hidden-xs', s.hideTabletSection)}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.instantBook} />
                  <MoreFilters
                  className={s.filterButtonContainer}
                  handleTabToggle={this.handleTabToggle}
                  isExpand={tabs.moreFilters}
                  searchSettings={searchSettings}
                  smallDevice={smallDevice} /> */}
                <div className={s.filterButtonContainer}>
                  <Button
                    className={cx({ [s.btnSecondary]: (isActive == true) },
                      s.btn, s.btnFontsize, s.responsiveFontsize, s.searchBtn)}
                    onClick={this.handleOpen}
                  >
                    <span className={cx('hidden-md hidden-lg')}>
                      Все фильтры
                    </span>
                    <span className={cx('hidden-xs hidden-sm')}>
                      Все фильтры
                    </span>
                  </Button>
                  <MoreFiltersModal
                    className={s.filterButtonContainer}
                    handleTabToggle={this.handleTabToggle}
                    isExpand={tabs.moreFilters}
                    searchSettings={searchSettings}
                    smallDevice={smallDevice}
                  />
                </div>

                <ShowMap
                  className={cx(s.filterButtonContainer, s.showMapSection, 'pull-right', 'hidden-xs', s.hideTabletSection, 'showMaprtl')}
                  handleTabToggle={this.handleTabToggle}
                />
              </div>
            </div>
          </div>
        </div>
        {
          // overlay && <div className={s.searchFilterPopoverOverlay} onClick={this.handleTabToggle}></div>
        }
      </div>
    );
  }
}

SearchHeader = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(SearchHeader);

const selector = formValueSelector('SearchForm'); // <-- same as form name

const mapState = state => ({
  currentPage: selector(state, 'currentPage'),
  sw_lat: selector(state, 'sw_lat'),
  sw_lng: selector(state, 'sw_lng'),
  ne_lat: selector(state, 'ne_lat'),
  ne_lng: selector(state, 'ne_lng'),
  formValues: getFormValues('SearchForm')(state),
  isResultLoading: state.search.isResultLoading,
});

const mapDispatch = {
  change,
  submitForm,
  openMoreFiltersModal,
};
// export default withStyles(s)(SearchHeader);
export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(SearchHeader)));
