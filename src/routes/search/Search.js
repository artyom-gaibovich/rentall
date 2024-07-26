// General
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { formatURL } from '../../helpers/formatURL.js';
// Redux
import { connect } from 'react-redux';
import { gql } from 'react-apollo';
import { graphql } from 'react-apollo';

// Redux Form
import { formValueSelector } from 'redux-form';

// Locale
import messages from '../../locale/messages';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { Button } from 'react-bootstrap';
import * as FontAwesome from 'react-icons/lib/fa';
import * as Material from 'react-icons/lib/md';
import s from './Search.css';
import "./Search.css";
// Components
import SearchForm from '../../components/SearchListing/SearchForm';
import SearchResults from '../../components/SearchListing/SearchResults';
import MapResults from '../../components/SearchListing/MapResults';
import Loader from '../../components/Loader';
// New Design
import SearchHeader from '../../components/SearchListing/SearchHeader';

// Redux Action
import { showMap, showResults, showForm, showFilter } from '../../actions/mobileSearchNavigation';
import { getListingFields } from '../../actions/getListingFields';

import ReactGoogleMapLoader from 'react-google-maps-loader';
import { googleMapAPI } from '../../config';

//yandex maps data
import {searchResultsData} from "../../actions/getSearchResults.js"
import {submitData} from "../../components/SearchListing/SearchForm/submit.js"

export class Search extends React.Component {
  // static resultData = searchResultsData;
  static scriptInit = false;
  static yandexMapMobile = true;
  static map = null;
  static added = {}
  static propTypes = {
    initialFilter: PropTypes.object,
    searchSettings: PropTypes.object,
    filterToggle: PropTypes.bool,
    showMap: PropTypes.func.isRequired,
    showResults: PropTypes.func.isRequired,
    showForm: PropTypes.func.isRequired,
    formatMessage: PropTypes.func,
    mobileSearch: PropTypes.shape({
      searchMap: PropTypes.bool,
      searchResults: PropTypes.bool,
      searchForm: PropTypes.bool,
    }),
    getListingFields: PropTypes.func,
  };

  static defaultProps = {
    mobileSearch: {
      searchMap: false,
      searchResults: true,
      searchForm: false,
      searchFilter: false,
    },
    isMapShow: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      smallDevice: false,
      load: false,
    };
 
    this.handleResize = this.handleResize.bind(this);
  }
  static async sleep(ms){
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
	static async initYmaps () {
    await Search.sleep(1000)
    //maps data undefined - onload page
    let searchedHouses
    if(submitData) {
       searchedHouses = submitData.results
    } else {
       searchedHouses = searchResultsData.results;
    }
    const mapSection = document.querySelector("#map")
    Search.yandexMapMobile = !Search.yandexMapMobile;
    // console.log(Search.yandexMapMobile)
    if(mapSection && mapSection.children.length === 0){
      Search.map = new ymaps.Map(mapSection, {
        center: [searchedHouses[0] ? searchedHouses[0].lat: 39, searchedHouses[0] ? searchedHouses[0].lng: 43],
        zoom: 12
      })
      ymaps.onHover 
      // Search.map.controls.remove("zoomControl");
      Search.map.controls.remove("searchControl");
      Search.map.controls.remove("geolocationControl");
      Search.map.controls.remove("trafficControl");
      Search.map.controls.remove("rulerControl");
      Search.map.controls.remove("typeSelector");
      // Search.map.behaviors.disable("scrollZoom");
      Search.map.behaviors.disable("dblClickZoom");
    }


  // }
    // // console.log(JSON.stringify(mapsData))
		try {
			// console.log('initing ymaps', initialFilter, searchSettings)
		} catch (E) {}

   
  //   const coverPhoto = Array.from(document.querySelectorAll("._3pERg.swiper-lazy.swiper-lazy-loaded"))
  //   const filteredCovers = coverPhoto.filter(function(_, index) {
  //     return index % 2 == 1;
  // })
    //const mapItems = await Search.getMapItems();
    // mapItems.map((item,index) => {
     searchedHouses.map((item,index) => {
      const coverPhotoUrl = item.listPhotos[0].name;
      const myGeoObject = new ymaps.GeoObject({
        roomId: item.id,
        geometry: {
            type: "Point",
            coordinates:[item.lat, item.lng]
        },
        modules:['geoObject.addon.balloon'],
        properties: {
          balloonContentHeader: `<a href="/rooms/${formatURL(item.title)}-${item.id}" target="_blank">${item.title}</a>`,
            balloonContentBody: `<a href="/rooms/${formatURL(item.title)}-${item.id}" target="_blank"><div style='background-image: url("/images/upload/${coverPhotoUrl}"); background-position: center; background-size: contain; background-repeat: no-repeat;height:150px; width: 150px'/></div></a> `,
            balloonContentFooter: item.listingData.basePrice + " за ночь",
            iconContent: item.listingData.basePrice,
        }
        }, {
        preset: 'islands#blackStretchyIcon'
      })
      myGeoObject.roomId = item.id

      Search.added[item.id] = true
      Search.map && Search.map.geoObjects.add(myGeoObject)
    })
		Search.map && Search.map.setBounds(Search.map.geoObjects.getBounds());
    const mapItems = await Search.getMapItems();
    mapItems.map((item,index) => {
      if (!Search.added[item.id]) {
        
        const coverPhotoUrl = item.listPhotos[0].name;
        const myGeoObject = new ymaps.GeoObject({
          geometry: {
              type: "Point",
              coordinates:[item.lat, item.lng]
          },
          modules:['geoObject.addon.balloon'],
          properties: {
            balloonContentHeader: `<a href="/rooms/${formatURL(item.title)}-${item.id}" target="_blank">${item.title}</a>`,
              balloonContentBody: `<a href="/rooms/${formatURL(item.title)}-${item.id}" target="_blank"><div style='background-image: url("/images/upload/${coverPhotoUrl}"); background-position: center; background-size: contain; background-repeat: no-repeat;height:150px; width: 150px'/></div></a> `,
              balloonContentFooter: item.listingData.basePrice + " за ночь",
              iconContent: item.listingData.basePrice,
          }
          }, {
          preset: 'islands#blackStretchyIcon'
        })
        myGeoObject.roomId = item.id
        Search.map && Search.map.geoObjects.add(myGeoObject)
      } else {
        // console.log('skip early added item')
      }
      
    })
	}
  

  componentWillMount() {
    const { getListingFields } = this.props;
    // Get listing settings fields data
    getListingFields();
    // this.getMapItems();
  }

  componentDidMount() {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      this.handleResize();
      window.addEventListener("ymap_hover", function(event) { 
        // alert("catch ymap_hover event" + event.target.tagName);
        // console.log("catch ymap_hover event", event.detail.id)
        if (Search.map) {
          Search.map.geoObjects.each(object => {
            if (object.roomId == event.detail.id) {
              object.options.set('preset', 'islands#redStretchyIcon');
              object.options.set('zIndex', 999);
              // console.log(object.roomId, object)
            } else {
              object.options.set('preset', 'islands#blackStretchyIcon');
              object.options.set('zIndex', 1);

  
            }
          })
        }

      });
      window.addEventListener('resize', this.handleResize);
    }
    
// if(!Search.scriptInit){
//   const script = document.createElement("script");
//   Search.scriptInit = true;
//   script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=1f9e09ab-8f4c-467c-ba4b-6a2528430eb5";
//   // <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=<ваш API-ключ>" type="text/javascript"></script>
//   script.async = true;
//   document.body.appendChild(script);
// }

	let ymapsInitInterval = setInterval(() => {
		if (!ymaps) {
			// console.log('ymaps not defined, wait and try again')
			return false
		} else {
			// console.log('ymaps inited')
			clearInterval(ymapsInitInterval)
			ymaps.ready(Search.initYmaps)
			this.setState({
				load: true,
			});
			// console.log('ymaps init end')

			return false
		}
	}, 200)
  }
  // componentDidUpdate(prevProps, prevState) {
  //   // console.log("notUpdated")
  //   if (prevState.housesData !== this.state.housesData) {
  //     // console.log('data changed')
  //     ymaps.ready(this.initYmaps)
  //   }
  // }
  componentWillUnmount() {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.removeEventListener('resize', this.handleResize);
    }
  }
  static async getMapItems () {
    // lol, sorry 4 that
    const query = `
      query SearchListingMap {
        SearchListingMap {
          count
          results {
            id
            title
            lat
            lng
            coverPhoto
            listPhotos {
              id
              name
              type
              status
            }
            listingData {
              basePrice
              currency
            }
          }
        }
      }
    `;
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        // variables: [],
      }),
      credentials: 'include',
    });
  
    const response = await resp.json();
    // console.log('map results', response, query)
    return response.data.SearchListingMap.results.filter(item => item.title && item.listPhotos.length && item.lat && item.lng)
  }
  handleResize(e) {
    const { showResults } = this.props;
    const isBrowser = typeof window !== 'undefined';
    const smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : false;
    if (smallDevice) {
      showResults();
    }
    this.setState({ smallDevice });
  }

  mobileNavigation() {
    const {
      mobileSearch: { searchMap, searchResults },
      showMap,
      showResults,
      showForm,
    } = this.props;

    let leftNav,
      rightNav;
    if (searchResults) {
      leftNav = <Button className={cx(s.filterButton, s.locationBtn)} bsStyle="link" onClick={() => {Search.initYmaps(); document.querySelector(".searchMapSection").classList.toggle(s.nonactiveMap); }}><Material.MdRoom className={s.icon} /></Button>;
      rightNav = <Button className={cx(s.filterButton)} bsStyle="link" onClick={() => showForm()}><FormattedMessage {...messages.filters} /><FontAwesome.FaSliders /></Button>;
    }

    if (searchMap) {
      leftNav = <Button className={cx(s.filterButton)} bsStyle="link"><FormattedMessage {...messages.results} />{' '}<Material.MdSettingsInputComposite className={s.icon} /></Button>;
      rightNav = <Button className={cx(s.filterButton)} bsStyle="link" onClick={() => showForm()}><FormattedMessage {...messages.filters} /><FontAwesome.FaSliders /></Button>;
    }

    return (
      <div className={cx(s.mobileNavigation)}>
        <div className={s.buttonOuter}>
          <div className={cx(s.buttonContainer)}>
            {
              leftNav
            }
            {
              // rightNav
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      mobileSearch: { searchMap, searchResults, searchForm, searchFilter },
      searchSettings,
      initialFilter,
      filterToggle,
      isMapShow,
      showFilter,
      showResults,
    } = this.props;

    const { smallDevice, load } = this.state;


    let DesktopResults = true;
    if (filterToggle === true) {
      DesktopResults = false;
    }
    const isBrowser = typeof window !== 'undefined';

    if (!load || !isBrowser) {
      return (
        <div className={s.searchLoaderContainer}>
          <Loader type={'text'} />
        </div>
      );
    }

    return (
      <div className={cx(s.root, 'searchPage')}>
        <div className={s.container}>
          {
            !smallDevice && <SearchHeader searchSettings={searchSettings} />
          }
          {
            smallDevice && !searchMap && <SearchHeader showFilter={showFilter} showResults={showResults} searchSettings={searchSettings} />
          }
          <div className={cx(s.searchResultContainer, { [s.listItemOnly]: isMapShow == false })}>
            {/* {
              !smallDevice && <div className={cx(s.filtersBody)}>
                <SearchForm initialFilter={initialFilter} searchSettings={searchSettings} />
              </div>
            }

            {
              smallDevice && searchForm && <div className={cx(s.filtersBody)}>
                <SearchForm initialFilter={initialFilter} searchSettings={searchSettings} />
              </div>
            } */}

            {
              !smallDevice && DesktopResults && <div className={cx(s.resultsBody)}>
                <SearchResults />
              </div>
            }

            {
              smallDevice && searchResults && <div className={cx(s.resultsBody)}>
                <SearchResults />
              </div>
            }

          </div>

          {
            !smallDevice && <div className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl')}>
              <div id="map" style={{height: '100%', width: '100%', display:'block'}}>

              </div>
              {/* <ReactGoogleMapLoader
                params={{
                  key: googleMapAPI, // Define your api key here
                  libraries: 'places,geometry,markerwithlabel', // To request multiple libraries, separate them with a comma
                }}
                render={googleMaps =>
                  googleMaps && (
                    <MapResults initialFilter={initialFilter} searchSettings={searchSettings} />
                  )}
              /> */}
            </div>
          }
           {smallDevice &&  <div style={{display:"block"}} className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl', s.nonactiveMap)}> 
          <div id="map" style={{height: '100%', maxWidth: '700px'}}>
            </div>
            </div> }
          {
            smallDevice && searchMap && <div className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl')}>
              <MapResults initialFilter={initialFilter} searchSettings={searchSettings} />
              
            </div>
          }

          {
            !searchForm && this.mobileNavigation()
          }

        </div>
      </div>
    );
  }
}

const selector = formValueSelector('SearchForm');

const mapState = state => ({
  filterToggle: state.toggle.filterToggle,
  mobileSearch: state.mobileSearch.data,
  isMapShow: state.personalized.showMap,
});

const mapDispatch = {
  showMap,
  showResults,
  showForm,
  getListingFields,
  showFilter,
};

export default withStyles(s)(connect(mapState, mapDispatch)(Search));