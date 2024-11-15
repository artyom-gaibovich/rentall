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
import submit from '../SearchForm/submit';


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
    };
    this.handlePagination = this.handlePagination.bind(this);
    this.handlePaginationNotMap = this.handlePaginationNotMap.bind(this);
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
    await Search.initYmaps();
    console.log("Карта обновлена после завершения загрузки данных");
  }

  componentDidUpdate(prevProps) {
    if (this.props.results !== prevProps.results) {
      console.log('qsx')
      this.refreshYmaps();
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
    // await this.refreshYmaps();
    console.log('refreshYmaps 99');

    window.scrollTo(0, 0);
  }


  render() {
    const { page } = this.state;
    const { results, total, isResultLoading, showMap, showMapLoader, guests, visibleMapItems, mapBounds, smallDevice } = this.props;
    console.log('see', results)

    // const startIndex = (page - 1) * 12;
    // const paginatedItems = visibleMapItems.slice(startIndex, startIndex + 12)

    // if (!smallDevice && visibleMapItems != null && visibleMapItems.length > 0) {
    //   return (
    //     <div className={cx(s.searchResults, { [s.listItemOnly]: showMap == false })}>
    //       {
    //         !showMapLoader && <Row className={s.noMargin}>

    //           <div className={cx(s.resultsContainer, 'resultsContainerRtl')}>
    //             {/* <Loader
    //                 type={"page"}
    //                 show={isResultLoading}
    //               /> */}
    //             {
    //               isResultLoading && <div className={s.loadingOverlay} />
    //             }
    //             {
    //               paginatedItems.map((item, listIndex) => (
    //                 <div className={cx(s.listItem, s.displayInlineBlock)} key={item.id}>
    //                   <ListingItem
    //                     id={item.id}
    //                     basePrice={item.listingData.basePrice}
    //                     currency={item.listingData.currency}
    //                     title={item.title}
    //                     beds={item.beds}
    //                     personCapacity={item.personCapacity}
    //                     roomType={item.settingsData[0].listsettings.itemName}
    //                     coverPhoto={item.coverPhoto}
    //                     listPhotos={item.listPhotos}
    //                     bookingType={item.bookingType}
    //                     reviewsCount={item.reviewsCount}
    //                     reviewsStarRating={item.reviewsStarRating}
    //                     wishListStatus={item.wishListStatus}
    //                     isListOwner={item.isListOwner}
    //                     personCount={guests}

    //                   />
    //                 </div>
    //                 ))
    //             }
    //           </div>
    //           <div className={s.resultsFooter}>
    //             <div className={s.resultsPagination}>
    //               <div className={s.pagination}>
    //                 <CustomPagination
    //                   total={visibleMapItems.length}
    //                   current={page}
    //                   defaultCurrenct={1}
    //                   defaultPageSize={12}
    //                   handleChange={this.handlePagination}

    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         </Row>
    //       }
    //     </div>
    //   );
    // }
    if (results != null && results.length > 0) {
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
    return (
      <div>
        {
          isResultLoading && <div className={s.loadingOverlay} />
        }
        <NoResults />
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
  total: state.search.count,
  isResultLoading: state.search.isResultLoading,
  showMap: state.personalized.showMap,
  showMapLoader: state.loader.showMapLoading,
  guests: Number(selector(state, 'personCapacity')),
});

const mapDispatch = {
  change,
  submitForm,
};

export default withStyles(s)(connect(mapState, mapDispatch)(SearchResults));