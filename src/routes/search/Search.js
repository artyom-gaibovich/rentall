// General
import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {formatURL} from '../../helpers/formatURL.js';
// Redux
import {connect} from 'react-redux';
import {gql} from 'react-apollo';
import {graphql} from 'react-apollo';

// Redux Form
import {formValueSelector} from 'redux-form';

// Locale
import messages from '../../locale/messages';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {Button} from 'react-bootstrap';
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
import {showMap, showResults, showForm, showFilter} from '../../actions/mobileSearchNavigation';
import {getListingFields} from '../../actions/getListingFields';

import ReactGoogleMapLoader from 'react-google-maps-loader';
import {googleMapAPI} from '../../config';

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
            count: 0,
            load: false,
        };

        this.handleResize = this.handleResize.bind(this);
    }

    static async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

/*
    static async initYmaps() {
        await Search.sleep(50)
        let searchedHouses
        if (submitData) {
            searchedHouses = submitData.results
        } else {
            searchedHouses = searchResultsData.results;
        }
        const mapSection = document.querySelector("#map")
        Search.yandexMapMobile = !Search.yandexMapMobile;
        console.log('thart is 1')
        if (mapSection && mapSection.children.length === 0) {
            Search.map = new ymaps.Map(mapSection, {
                center: [searchedHouses[0] ? searchedHouses[0].lat : 39, searchedHouses[0] ? searchedHouses[0].lng : 43],
                zoom: 12
            })
            ymaps.onHover
            let clustererMobile;
            let geoObjectsMobile;
            let getPointOptionsMobile;
            let getPointDataMobile;
            let pointsMobile;

            clustererMobile = new ymaps.Clusterer({
                preset: 'islands#invertedVioletClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: true,
                balloonContentLayout: 'cluster#balloonTwoColumns',
            })

            clustererMobile.options.set({
                maxZoom: 30,
                gridSize: 180,
                hasBalloon: false,
                hasHint: false,

            });


            getPointDataMobile = function (index, title, id, listingData, coverPhotoUrl) {
                return {
                    balloonContentHeader: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank">${title}</a>`,
                    balloonContentBody: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank"><div style='background-image: url("/images/upload/${coverPhotoUrl}"); background-position: center; background-size: contain; background-repeat: no-repeat;height:150px; width: 150px'/></div></a> `,
                    balloonContentFooter: listingData.basePrice + " за ночь",
                    iconContent: listingData.basePrice,
                };
            },
                pointsMobile = searchedHouses.map(el => {
                    return [el.lat, el.lng]
                })
            geoObjectsMobile = [];
            getPointOptionsMobile = function () {
                return {
                    preset: 'islands#blackStretchyIcon'
                };
            }
            for (var i = 0, len = searchedHouses.length; i < len; i++) {
                geoObjectsMobile[i] = new ymaps.Placemark(pointsMobile[i], getPointDataMobile(i, searchedHouses[i].title, searchedHouses[i].id, searchedHouses[i].listingData, searchedHouses[i].listPhotos[0].name), getPointOptionsMobile());
            }


            clustererMobile.add(geoObjectsMobile);
            clustererMobile.events.once('objectsaddtomap', function () {
                Search.map.setBounds(clustererMobile.getBounds());
            });
            clustererMobile.events.add(['mouseenter', 'mouseleave'], function (e) {
                var target = e.get('target'),
                    eType = e.get('type'),
                    zIndex = Number(eType === 'mouseenter') * 1000;

                target.options.set('zIndex', zIndex);
            });
            Search.map && Search.map.geoObjects.add(clustererMobile);


            Search.map.controls.remove("searchControl");
            Search.map.controls.remove("geolocationControl");
            Search.map.controls.remove("trafficControl");
            Search.map.controls.remove("rulerControl");
            Search.map.controls.remove("typeSelector");
            Search.map.behaviors.disable("dblClickZoom");
        }
        searchedHouses.map((item, index) => {
            const coverPhotoUrl = item.listPhotos[0].name;
            const myGeoObject = new ymaps.GeoObject({
                roomId: item.id,
                geometry: {
                    type: "Point",
                    coordinates: [item.lat, item.lng]
                },
                modules: ['geoObject.addon.balloon'],
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
        })

        Search.map && Search.map.setBounds(Search.map.geoObjects.getBounds());
        //Search.map && Search.map.setBounds(Search.map.geoObjects.getBounds());


        //const mapItems = await Search.getMapItems();
        const mapItems = [{
            id: 1239,
            title: "Лучший дом на свете",
            lat: 46.114432,
            lng: 48.067548,
            coverPhoto: 24133,
            listPhotos: [
                {
                    id: 24133,
                    name: "3b28f37527778a9e19b16fe86a68434a.png",
                    type: "image/png",
                    status: null
                },
                {
                    id: 24134,
                    name: "cea4cb9f772103b7297a232508d62667.png",
                    type: "image/png",
                    status: null
                }
            ],
            listingData: {
                basePrice: 1,
                currency: "RUB"
            }
        }]
        console.log('thart is 2')

        let clusterer;
        let geoObjects;
        let getPointOptions;
        let getPointData;
        let points;


        clusterer = new ymaps.Clusterer({
            preset: 'twirl#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        })

        clusterer.options.set({
            maxZoom: 30,
            gridSize: 180,
            hasBalloon: false,
            hasHint: false,
            clusterDisableClickZoom: true,
        });


        getPointData = function (index, title, id, listingData, coverPhotoUrl) {
            return {
                balloonContentHeader: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank">${title}</a>`,
                balloonContentBody: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank"><div style='background-image: url("/images/upload/${coverPhotoUrl}"); background-position: center; background-size: contain; background-repeat: no-repeat;height:150px; width: 150px'/></div></a> `,
                balloonContentFooter: listingData.basePrice + " за ночь",
                iconContent: listingData.basePrice,
            };
        },
            points = mapItems.map(el => {
                return [el.lat, el.lng]
            })
        geoObjects = [];
        getPointOptions = function () {
            return {
                preset: 'islands#blackStretchyIcon'
            };
        }
        for (var i = 0, len = mapItems.length; i < len; i++) {
            geoObjects[i] = new ymaps.Placemark(points[i], getPointData(i, mapItems[i].title, mapItems[i].id, mapItems[i].listingData, mapItems[i].listPhotos[0].name), getPointOptions());
        }
        clusterer.add(geoObjects);
        clusterer.events.once('objectsaddtomap', function () {
            Search.map.setBounds(clusterer.getBounds());
        });
        clusterer.events.add(['mouseenter', 'mouseleave'], function (e) {
            var target = e.get('target'), // Геообъект - источник события.
                eType = e.get('type'), // Тип события.
                zIndex = Number(eType === 'mouseenter') * 1000; // 1000 или 0 в зависимости от типа события.

            target.options.set('zIndex', zIndex);
        });
        Search.map && Search.map.geoObjects.add(clusterer);

    }
*/

    static async initYmaps () {
        await Search.sleep(1000)
        let searchedHouses
        let clusterer;
        let geoObjects;
        let getPointOptions;
        let getPointData;
        let mapPoints;
        let housePoints;
        getPointOptions = function () {
            return {
                preset: 'islands#blackStretchyIcon'
            };
        }
        geoObjects = [];

        clusterer = new ymaps.Clusterer({
            preset: 'twirl#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        })
        clusterer.options.set({
            maxZoom: 30,
            gridSize: 180,
            hasBalloon: false,
            hasHint: false,
            clusterDisableClickZoom: true,
        });
        getPointData = function (index, title, id, listingData, coverPhotoUrl) {
            return {
                balloonContentHeader: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank">${title}</a>`,
                balloonContentBody: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank"><div style='background-image: url("/images/upload/${coverPhotoUrl}"); background-position: center; background-size: contain; background-repeat: no-repeat;height:150px; width: 150px'/></div></a> `,
                balloonContentFooter: listingData.basePrice + " за ночь",
                iconContent: listingData.basePrice,
            };
        }

        if(submitData) {
            searchedHouses = submitData.results
        } else {
            searchedHouses = searchResultsData.results;
        }
        const mapSection = document.querySelector("#map")
        Search.yandexMapMobile = !Search.yandexMapMobile;
        const mapItems = await Search.getMapItems();
        if(mapSection && mapSection.children.length === 0){
            Search.map = new ymaps.Map(mapSection, {
                center: [searchedHouses[0] ? searchedHouses[0].lat: 39, searchedHouses[0] ? searchedHouses[0].lng: 43],
                zoom: 12
            })
            ymaps.onHover
            Search.map.controls.remove("searchControl");
            Search.map.controls.remove("geolocationControl");
            Search.map.controls.remove("trafficControl");
            Search.map.controls.remove("rulerControl");
            Search.map.controls.remove("typeSelector");
            Search.map.behaviors.disable("dblClickZoom");
        }

/*
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
*/



        mapPoints = mapItems.map(el => {
            return [el.lat, el.lng]
        })
        housePoints = searchedHouses.map(el => {
            return [el.lat, el.lng]
        })


        for (var i = 0, len = mapItems.length; i < len; i++) {
            geoObjects[i] = new ymaps.Placemark(mapPoints[i], getPointData(i, mapItems[i].title, mapItems[i].id, mapItems[i].listingData, mapItems[i].listPhotos[0].name), getPointOptions());
        }
        for (var i = 0, len = searchedHouses.length; i < len; i++) {
            geoObjects[i] = new ymaps.Placemark(housePoints[i], getPointData(i, mapItems[i].title, mapItems[i].id, mapItems[i].listingData, mapItems[i].listPhotos[0].name), getPointOptions());
        }
        clusterer.add(geoObjects);
        clusterer.events.once('objectsaddtomap', function () {
            Search.map.setBounds(clusterer.getBounds());
        });
        clusterer.events.add(['mouseenter', 'mouseleave'], function (e) {
            var target = e.get('target'), // Геообъект - источник события.
                eType = e.get('type'), // Тип события.
                zIndex = Number(eType === 'mouseenter') * 1000; // 1000 или 0 в зависимости от типа события.

            target.options.set('zIndex', zIndex);
        });
        Search.map && Search.map.geoObjects.add(clusterer);

    }



    componentWillMount() {
        const {getListingFields} = this.props;
        // Get listing settings fields data
        getListingFields();
        // this.getMapItems();
    }

    componentDidMount() {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            this.handleResize();
            window.addEventListener("ymap_hover", function (event) {
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


        let ymapsInitInterval = setInterval(() => {
            if (!ymaps) {
                return false
            } else {
                clearInterval(ymapsInitInterval)
                ymaps.ready(Search.initYmaps)
                this.setState({
                    load: true,
                });

                return false
            }
        }, 200)
    }

    componentWillUnmount() {
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            window.removeEventListener('resize', this.handleResize);
        }
    }

    static async getMapItems() {
        const cacheKey = 'mapItemsCache';
        const cacheTimeKey = 'mapItemsCacheTime';
        const cacheDuration = 1000 * 60 * 60 * 24 * 7; // Кэшируем данные на 10 минут

        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);

        if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < cacheDuration) {
            console.log('Returning cached data');
            console.log(JSON.parse(cachedData).slice(0, 10))
            return JSON.parse(cachedData);
        }
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
            body: JSON.stringify({query}),
            credentials: 'include',
        });
        const response = await resp.json();
        console.log('map results_', response, query);

        const filteredResults = response.data.SearchListingMap.results.filter(item => item.title && item.listPhotos.length && item.lat && item.lng);

        // Сохраняем данные в кэш
        localStorage.setItem(cacheKey, JSON.stringify(filteredResults));
        localStorage.setItem(cacheTimeKey, Date.now().toString());

        return filteredResults;
    }

    handleResize(e) {
        const {showResults} = this.props;
        const isBrowser = typeof window !== 'undefined';
        const smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : false;
        if (smallDevice) {
            showResults();
        }
        this.setState({smallDevice});
    }

    mobileNavigation() {
        const {
            mobileSearch: {searchMap, searchResults},
            showMap,
            showResults,
            showForm,
        } = this.props;

        let leftNav,
            rightNav;
        if (searchResults) {
            leftNav = <Button className={cx(s.filterButton, s.locationBtn)} bsStyle="link" onClick={() => {
                Search.initYmaps();
                document.querySelector(".searchMapSection").classList.toggle(s.nonactiveMap);
            }}><Material.MdRoom className={s.icon}/></Button>;
            rightNav = <Button className={cx(s.filterButton)} bsStyle="link"
                               onClick={() => showForm()}><FormattedMessage {...messages.filters} /><FontAwesome.FaSliders/></Button>;
        }

        if (searchMap) {
            leftNav = <Button className={cx(s.filterButton)}
                              bsStyle="link"><FormattedMessage {...messages.results} />{' '}<Material.MdSettingsInputComposite
                className={s.icon}/></Button>;
            rightNav = <Button className={cx(s.filterButton)} bsStyle="link"
                               onClick={() => showForm()}><FormattedMessage {...messages.filters} /><FontAwesome.FaSliders/></Button>;
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
            mobileSearch: {searchMap, searchResults, searchForm, searchFilter},
            searchSettings,
            initialFilter,
            filterToggle,
            isMapShow,
            showFilter,
            showResults,
        } = this.props;

        const {smallDevice, load} = this.state;


        let DesktopResults = true;
        if (filterToggle === true) {
            DesktopResults = false;
        }
        const isBrowser = typeof window !== 'undefined';

        if (!load || !isBrowser) {
            return (
                <div className={s.searchLoaderContainer}>
                    <Loader type={'text'}/>
                </div>
            );
        }

        return (
            <div className={cx(s.root, 'searchPage')}>
                <div className={s.container}>
                    {
                        !smallDevice && <SearchHeader searchSettings={searchSettings}/>
                    }
                    {
                        smallDevice && !searchMap && <SearchHeader showFilter={showFilter} showResults={showResults}
                                                                   searchSettings={searchSettings}/>
                    }
                    <div className={cx(s.searchResultContainer, {[s.listItemOnly]: isMapShow == false})}>
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
                                <SearchResults/>
                            </div>
                        }

                        {
                            smallDevice && searchResults && <div className={cx(s.resultsBody)}>
                                <SearchResults/>
                            </div>
                        }

                    </div>

                    {
                        !smallDevice &&
                        <div className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl')}>
                            <div id="map" style={{height: '100%', width: '100%', display: 'block'}}>

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
                    {smallDevice && <div style={{display: "block"}}
                                         className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl', s.nonactiveMap)}>
                        <div id="map" style={{height: '100%', maxWidth: '700px'}}>
                        </div>
                    </div>}
                    {
                        smallDevice && searchMap &&
                        <div className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl')}>
                            <MapResults initialFilter={initialFilter} searchSettings={searchSettings}/>

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
