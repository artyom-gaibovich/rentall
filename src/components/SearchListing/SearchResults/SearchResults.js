import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Redux Form
import { change, submit as submitForm, formValueSelector, reduxForm } from 'redux-form';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchResults.css';
import cx from 'classnames';
import {
  Row,
} from 'react-bootstrap';

// Component
import CustomPagination from '../CustomPagination';
import ListingItem from '../ListingItem';
import NoResults from '../NoResults';
import AllResults from '../AllResults';
import submit from '../SearchForm/submit';

import {showResults} from "../../../actions/mobileSearchNavigation.js"

//yandex maps
import { searchResultsData } from "../../../actions/getSearchResults.js"
import { Search } from "../../../routes/search/Search.js"
class SearchResults extends React.Component {
  static propTypes = {
    change: PropTypes.any,
    submitForm: PropTypes.any,
    results: PropTypes.array,
    currentPage: PropTypes.number,
    total: PropTypes.number,
    isResultLoading: PropTypes.bool,
    visibleMapItems: PropTypes.array,
    mapBounds: PropTypes.array,
    smallDevice: PropTypes.bool,
    initialFilter: PropTypes.array,
  };

  static defaultProps = {
    results: [],
    isResultLoading: true,
    showMap: false,
    showMapLoader: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      ne_lat: 0,
      ne_lng: 0,
      sw_lat: 0,
      sw_lng: 0,
      smallDevice: false
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.handlePaginationNotMap = this.handlePaginationNotMap.bind(this);
  }

  async handleSubmit() {
    console.log('Submitting map data');
    console.log(this.state); // Проверка текущего состояния, включая координаты границ

    const { change, submitForm } = this.props;

    // Обновление значений формы координатами карты
    await change('currentPage', 1);
    await change('sw_lat', this.state.sw_lat);
    await change('sw_lng', this.state.sw_lng);
    await change('ne_lat', this.state.ne_lat);
    await change('ne_lng', this.state.ne_lng);

    // Отправка формы с обновлёнными данными
    await submitForm('SearchForm');

    console.log('Data submitted to backend');
}


  async refreshYmaps() {
    // Функция для проверки состояния загрузки каждые 100 мс
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
    await Search.clearMapInstance();
    await Search.initYmaps(this);
    console.log("Карта обновлена после завершения загрузки данных");
  }

  async componentDidUpdate(prevProps, prevState) {
    const currentSearch = window.location.search;
    const prevSearch = prevState.location && prevState.location.search;
  
    if (currentSearch !== prevSearch) {
      console.log('URL изменился, обновляем карту');
      this.refreshYmaps();
      this.setState({ location: { search: currentSearch } });
    } else {
      if (typeof localStorage !== 'undefined') {
        if (localStorage.getItem('locationRefresh') === 'true') {
          console.log('URL не изменился, обновляем карту');
          this.refreshYmaps();
          localStorage.setItem('locationRefresh', 'false');
        }
      }
    }
  }

  componentDidMount() {
    let { currentPage, visibleMapItems, results } = this.props;
    if (currentPage != undefined) {
      this.setState({ page: currentPage });
    }

  }

  componentWillReceiveProps(nextProps) {
    const { currentPage } = nextProps;
    if (currentPage != undefined) {
      this.setState({ page: currentPage });
    }
  }

  async handlePagination(currenctPage, size) {
    this.setState({ page: currenctPage })
    await this.refreshYmaps();
    console.log('refreshYmaps 89');
    window.scrollTo(0, 0);
  }

  async handlePaginationNotMap(currenctPage, size) {
    const { change, submitForm } = this.props;
    console.log(currenctPage, 'currenctPage 94')

    // Обновляем текущую страницу
    await change('currentPage', currenctPage);

    // Ждём завершения submitForm
    await submitForm('SearchForm');

    // После завершения обновляем карту
    await this.refreshYmaps();
    console.log('refreshYmaps 99');

    window.scrollTo(0, 0);
  }


  render() {
    const { page } = this.state;
    const { results, total, isResultLoading, showMap, showMapLoader, guests, visibleMapItems, mapBounds, smallDevice, initialFilter } = this.props;
    console.log('see', results)

    if (results != null && results.length > 0 && initialFilter.address) {
      return (
        <div className={cx(s.searchResults, { [s.listItemOnly]: showMap == false })}>
          {
            !showMapLoader && <Row className={s.noMargin}>

              <div className={cx(s.resultsContainer, 'resultsContainerRtl')}>
                {/* <Loader
                    type={"page"}
                    show={isResultLoading}
                  /> */}
                {
                  isResultLoading && <div className={s.loadingOverlay} />
                }
                {
                  results.map((item, listIndex) => (
                    <div className={cx(s.listItem, s.displayInlineBlock)} key={item.id}>
                      <ListingItem
                        id={item.id}
                        basePrice={item.listingData.basePrice}
                        currency={item.listingData.currency}
                        title={item.title}
                        beds={item.beds}
                        personCapacity={item.personCapacity}
                        roomType={item.settingsData[0].listsettings.itemName}
                        coverPhoto={item.coverPhoto}
                        listPhotos={item.listPhotos}
                        bookingType={item.bookingType}
                        reviewsCount={item.reviewsCount}
                        reviewsStarRating={item.reviewsStarRating}
                        wishListStatus={item.wishListStatus}
                        isListOwner={item.isListOwner}
                        personCount={guests}

                      />
                    </div>
                  ))
                }
              </div>
              <div className={s.resultsFooter}>
                <div className={s.resultsPagination}>
                  <div className={s.pagination}>
                    <CustomPagination
                      total={total}
                      current={page}
                      defaultCurrenct={1}
                      defaultPageSize={12}
                      handleChange={this.handlePaginationNotMap}

                    />
                  </div>
                </div>
              </div>
            </Row>
          }
        </div>
      );
    }
    if (initialFilter.address) {
      return (
        <div>
          {
            isResultLoading && <div className={s.loadingOverlay} />
          }
          <NoResults />
        </div>
      )
    }
    return (
      <div>
        {
          isResultLoading && <div className={s.loadingOverlay} />
        }
        <AllResults />
      </div>
    )
  }
}

SearchResults = reduxForm({
  form: 'SearchForm', // a unique name for this form
  onSubmit: submit,
  destroyOnUnmount: false,
})(SearchResults);


const selector = formValueSelector('SearchForm');

const mapState = state => ({
  results: state.search.data,
  currentPage: selector(state, 'currentPage'),
  sw_lat: selector(state, 'sw_lat'),
  sw_lng: selector(state, 'sw_lng'),
  ne_lat: selector(state, 'ne_lat'),
  ne_lng: selector(state, 'ne_lng'),
  total: state.search.count,
  isResultLoading: state.search.isResultLoading,
  showMap: state.personalized.showMap,
  showMapLoader: state.loader.showMapLoading,
  guests: Number(selector(state, 'personCapacity')),
});

const mapDispatch = {
  change,
  submitForm,
  showResults,
};

export default withStyles(s)(connect(mapState, mapDispatch)(SearchResults));