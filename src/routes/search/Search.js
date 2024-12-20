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
import { formValueSelector, getFormValues, change, submit as submitForm, reduxForm } from 'redux-form';

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
import { searchResultsData } from "../../actions/getSearchResults.js"
import { submitData } from "../../components/SearchListing/SearchForm/submit.js"
import { submitMapData } from "../../components/SearchListing/SearchForm/submitMap.js"
import submit from "../../components/SearchListing/SearchForm/submit.js"
import {getValuesFilter} from "../../components/SearchListing/SearchForm/submit.js"
let geoObjectsGlobal
let clustererGlobal

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
            visibleMapItems: [],
            mapBounds: [],
            filter: 0,
            lat: 0,
            lng: 0,
            ne_lat: 0,
            ne_lng: 0,
            sw_lat: 0,
            sw_lng: 0,
        };

        this.handleResize = this.handleResize.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Метод для полной очистки карты
    static async clearMapInstance() {
        if (Search.map) {
            Search.map.geoObjects.removeAll(); // Удаление всех объектов с карты
            Search.map.destroy(); // Полностью уничтожаем экземпляр карты
            Search.map = null; // Сбрасываем ссылку на экземпляр карты
            Search.scriptInit = false; // Флаг для повторной инициализации при необходимости
            Search.yandexMapMobile = true; // Переключение флага мобильной карты (если требуется)
        }
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
      }

    setFilters = (newFilters) => {
        this.setState({ filter: newFilters });
    };

    static async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static getCenter(locations) {
        let minLng = Infinity, maxLng = -Infinity;
        let minLat = Infinity, maxLat = -Infinity;

        locations.forEach(location => {
            if (location.lng < minLng) minLng = location.lng;
            if (location.lng > maxLng) maxLng = location.lng;
            if (location.lat < minLat) minLat = location.lat;
            if (location.lat > maxLat) maxLat = location.lat;
        });

        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;

        return { lng: centerLng, lat: centerLat };
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

    static mapItemMouse(value) {
    console.log(geoObjectsGlobal)
    const item = geoObjectsGlobal.find(obj => obj.id === value);
    if (item) {
        console.log(item);
        item.placemark.options.set('iconColor', 'red'); // Меняем цвет

        console.log(clustererGlobal);

        const clusters = clustererGlobal.getClusters();

        // Проверяем, что кластеры получены
        if (clusters) {
            console.log(clusters);
            // Ищем кластер, который содержит этот геообъект
            clusters.forEach(cluster => {
                const clusterGeoObjects = cluster.getGeoObjects();
                if (clusterGeoObjects.includes(item.placemark)) { // предполагаем, что item.placemark - это ваш объект
                    console.log('LOOH')
                    console.log(cluster);
                    console.log(clusterGeoObjects);
                    cluster.options.set('preset', 'islands#redClusterIcons')
                }
            });
        } else {
            console.error("Кластеры не найдены.");
        }


        }
    }

    static mapItemMouseOut(value) {
    console.log(geoObjectsGlobal)
    const item = geoObjectsGlobal.find(obj => obj.id === value);
    if (item) {
        console.log(item);
        item.placemark.options.set('iconColor', 'black'); // Меняем цвет

        const clusters = clustererGlobal.getClusters();

        // Проверяем, что кластеры получены
        if (clusters) {
            console.log(clusters);
            // Ищем кластер, который содержит этот геообъект
            clusters.forEach(cluster => {
                const clusterGeoObjects = cluster.getGeoObjects();
                if (clusterGeoObjects.includes(item.placemark)) { // предполагаем, что item.placemark - это ваш объект
                    console.log('LOOH')
                    console.log(cluster);
                    console.log(clusterGeoObjects);
                    
                    cluster.options.set('preset', 'twirl#invertedVioletClusterIcons')
                }
            });
        } else {
            console.error("Кластеры не найдены.");
        }
    }
    }

    static async reloadYmaps() {
        // Search.map.clusterer.removeAll();
        Search.map.geoObjects.removeAll()

        let geoObjects;
        let getPointOptions;
        let getPointData;
        let mapPoints;
        let housePoints;
        let clusterer;

        clusterer = new ymaps.Clusterer({
            preset: 'twirl#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        })
        clusterer.options.set({
            minClusterSize: 3,
            maxZoom: 60,
            gridSize: 80,
            hasBalloon: false,
            hasHint: false,
            clusterDisableClickZoom: true,
        });

        getPointOptions = function () {
            return {
                preset: 'islands#blackStretchyIcon'
            };
        }
        geoObjects = [];
        getPointData = function (index, title, id, listingData, coverPhotoUrl) {
            return {
                balloonContentHeader: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank">${title}</a>`,
                balloonContentBody: `<a href="/rooms/${formatURL(title)}-${id}" target="_blank"><div style='background-image: url("/images/upload/${coverPhotoUrl}"); background-position: center; background-size: contain; background-repeat: no-repeat;height:150px; width: 150px'/></div></a> `,
                balloonContentFooter: listingData.basePrice + " за ночь",
                iconContent: listingData.basePrice,
            };
        }

        let mapItems = await Search.getMapItems();

        mapPoints = mapItems.map(el => {
            return [el.lat, el.lng]
        })
        housePoints = mapItems.map(el => {
            return [el.lat, el.lng]
        })


        geoObjectsGlobal = []
        for (var i = 0, len = mapItems.length; i < len; i++) {
            geoObjects[i] = new ymaps.Placemark(mapPoints[i], getPointData(i, mapItems[i].title, mapItems[i].id, mapItems[i].listingData, mapItems[i].listPhotos[0].name), getPointOptions());
            geoObjectsGlobal.push({ id: mapItems[i].id, placemark: geoObjects[i] })
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
        clusterer.events.add('click', function (e) {
            const cluster = e.get('target');
            // Увеличиваем зум при клике на класт
            if (cluster.getGeoObjects && cluster.getGeoObjects().length > 1) {
                const clusterBounds = cluster.getBounds(); 

                Search.map.setBounds(clusterBounds, {
                    checkZoomRange: true, 
                    zoomMargin: 5,
                    duration: 500
                });
            }
        });

        clustererGlobal = clusterer

        Search.map && Search.map.geoObjects.add(clusterer);
    }

    static async initYmaps(componentInstance) {
        await Search.sleep(1000)
        let searchedHouses
        let clusterer;
        let geoObjects;
        let getPointOptions;
        let getPointData;
        let mapPoints;
        let housePoints;

        let globalZoom;
        let globalCenter;
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
            minClusterSize: 3,
            maxZoom: 60,
            gridSize: 80,
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
                iconClassName: `mapItem${id}`,
            };
        }

        if (searchResultsData && searchResultsData.results.length > 0) {
            globalZoom = 6
            searchedHouses = searchResultsData.results;

        }


        const mapSection = document.querySelector("#map")
        Search.yandexMapMobile = !Search.yandexMapMobile;
        // let mapItems = []
        // if (submitMapData && submitMapData.length > 0) {
        //     mapItems = submitMapData
        // } else {
        // }
        
        let mapItems = await Search.getMapItems();
        
        console.log(searchResultsData)

        const mapSectionOne = document.querySelector(".searchMapSection");
        if (mapSection && mapSection.children.length === 0 && searchResultsData && searchResultsData.results.length > 0 && componentInstance.props.initialFilter.address) {
            if (componentInstance.state.smallDevice) {       
                if (mapSectionOne.classList.contains(s.nonactiveMap)) {
                mapSectionOne.classList.remove(s.nonactiveMap);
                mapSectionOne.style.visibility = 'hidden';
                }
            }
            
            const sw_lat = componentInstance.props.formValues.sw_lat; // Юго-западная широта
            const sw_lng = componentInstance.props.formValues.sw_lng; // Юго-западная долгота
            const ne_lat = componentInstance.props.formValues.ne_lat; // Северо-восточная широта
            const ne_lng = componentInstance.props.formValues.ne_lng; // Северо-восточная долгота
            
            Search.map = new ymaps.Map(mapSection, {
                bounds: [[sw_lat, sw_lng], [ne_lat, ne_lng]],
            }, {
                minZoom: 2
            })

            Search.map.setBounds([[sw_lat, sw_lng], [ne_lat, ne_lng]], {
                checkZoomRange: true, // Активируем проверку диапазона зума
            });
            ymaps.onHover
            Search.map.controls.remove("searchControl");
            Search.map.controls.remove("geolocationControl");
            Search.map.controls.remove("trafficControl");
            Search.map.controls.remove("rulerControl");
            Search.map.controls.remove("typeSelector");
            Search.map.behaviors.disable("dblClickZoom");

            if (componentInstance.state.smallDevice) {       
                if (!mapSectionOne.classList.contains(s.nonactiveMap)) {
                mapSectionOne.classList.add(s.nonactiveMap);
                mapSectionOne.style.visibility = 'visible';
                }
            }
            
            const updateVisibleItems = () => {
                const mapBounds = Search.map.getBounds();
                const mapSectionOne = document.querySelector(".searchMapSection");
                if (mapSectionOne.classList.contains(s.nonactiveMap)) {
                    return
                }

                if (mapBounds && mapBounds[0][0] && mapBounds[0][1] && mapBounds[1][0] && mapBounds[1][1] && mapBounds[0][0] > 0 && mapBounds[0][1] > 0 && mapBounds[1][0] > 0 && mapBounds[1][1] > 0) {
                const sw_lat = mapBounds[0][0]; // Юго-западная широта
                const sw_lng = mapBounds[0][1]; // Юго-западная долгота
                const ne_lat = mapBounds[1][0]; // Северо-восточная широта
                const ne_lng = mapBounds[1][1]; // Северо-восточная долгота
                // Обновление состояния компонента с новыми координатами
                componentInstance.setState({ sw_lat, sw_lng, ne_lat, ne_lng });

                // Отправка данных на сервер
                componentInstance.handleSubmit();
            }
        }
        
        // Добавление обработчика события на карту
        Search.map.events.add('boundschange', updateVisibleItems);
        
        // updateVisibleItems();
    }
        mapPoints = mapItems.map(el => {
            return [el.lat, el.lng]
        })
        housePoints = mapItems.map(el => {
            return [el.lat, el.lng]
        })


        geoObjectsGlobal = []
        for (var i = 0, len = mapItems.length; i < len; i++) {
            geoObjects[i] = new ymaps.Placemark(mapPoints[i], getPointData(i, mapItems[i].title, mapItems[i].id, mapItems[i].listingData, mapItems[i].listPhotos[0].name), getPointOptions());
            geoObjectsGlobal.push({ id: mapItems[i].id, placemark: geoObjects[i] })
        }
        // for (var i = 0, len = searchResultsData.results.length; i < len; i++) {
        //     geoObjects[i] = new ymaps.Placemark(
        //         housePoints[i],
        //         getPointData(i, mapItems[i].title, mapItems[i].id, mapItems[i].listingData, mapItems[i].listPhotos[0].name),
        //         getPointOptions()
        //     );
        // }
        clusterer.add(geoObjects);   
        clustererGlobal = clusterer
        clusterer.events.once('objectsaddtomap', function () {
            Search.map.setBounds(clusterer.getBounds());
        });
        clusterer.events.add(['mouseenter', 'mouseleave'], function (e) {
            const target = e.get('target'), // Геообъект - источник события.
                eType = e.get('type'), // Тип события.
                zIndex = Number(eType === 'mouseenter') * 1000; // 1000 или 0 в зависимости от типа события.

            target.options.set('zIndex', zIndex);

            if (typeof target.getGeoObjects != 'undefined') {
                // Событие произошло на кластере.
                if (eType == 'mouseenter') {
                    target.options.set('preset', 'islands#redClusterIcons');
                } else {
                    target.options.set('preset', 'twirl#invertedVioletClusterIcons');
                }
            } else {
                // Событие произошло на геообъекте.
                if (eType == 'mouseenter') {
                    target.options.set('iconColor', 'red');
                } else {
                    target.options.set('iconColor', 'black');
                }
            }
        });
        clusterer.events.add('click', function (e) {
            const cluster = e.get('target');
            // Увеличиваем зум при клике на класт
            if (cluster.getGeoObjects && cluster.getGeoObjects().length > 1) {
                const clusterBounds = cluster.getBounds(); 

                Search.map.setBounds(clusterBounds, {
                    checkZoomRange: true, 
                    zoomMargin: 5,
                    duration: 500
                });
            }
        });

        // geoObjectsGlobal = geoObjects
        console.log('tidish', geoObjects)
        Search.map && Search.map.geoObjects.add(clusterer);
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
            window.addEventListener("ymap_hover", function (event) {
                if (Search.map) {
                    Search.map.geoObjects.each(object => {
                        if (object.roomId == event.detail.id) {
                            object.options.set('preset', 'islands#redStretchyIcon');
                            object.options.set('zIndex', 999);
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
                ymaps.ready(Search.initYmaps(this))
                this.setState({
                    load: true,
                });

                return false
            }
        }, 200)

        const mapContainer = document.querySelector('.searchMapSection');
        if (mapContainer) {
            const fixedHeight = mapContainer.offsetHeight; // Запоминаем текущую высоту
            mapContainer.style.height = `${fixedHeight}px`; // Фиксируем её
        }
    }

    componentWillUnmount() {
        try {
            Search.clearMapInstance();

            // Сбрасываем локальные переменные состояния
            this.setState({
                ne_lat: 0,
                ne_lng: 0,
                sw_lat: 0,
                sw_lng: 0,
                load: false,
                visibleMapItems: [],
                mapBounds: [],
            });
        } catch (error) {
            console.warn('Error during component unmount:', error);
        }

        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            window.removeEventListener('resize', this.handleResize);
        }
    }

    static async getMapItems() {
        const cacheKey = 'mapItemsCache';
        const cacheTimeKey = 'mapItemsCacheTime';
        const cacheDuration = 1000 * 60 * 60 * 24 * 7; // Кэшируем данные на 10 минут
        const valuesFilter = getValuesFilter();

        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);

        if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < cacheDuration && !valuesFilter ) {
            return JSON.parse(cachedData);
        }
        const query = `
    query SearchListingMap(
    $personCapacity: Int,
    $dates: String,
    $currentPage: Int,
    $lat: Float,
    $lng: Float,
    $roomType: [Int],
    $bedrooms: Int,
    $bathrooms: Int,
    $beds: Int,
    $amenities: [Int],
    $safetyAmenities: [Int],
    $spaces: [Int],
    $houseRules: [Int],
    $fish: [Int],
    $priceRange: [Int],
    $geography: String,
    $bookingType: String,
    $geoType: String,
    $searchByMap: Boolean,
    $facilities: [Int],
    $eat: [Int],
    $rent: [Int],
    $help: [Int]
    ){
      SearchListingMap(
        personCapacity: $personCapacity,
        dates: $dates,
        currentPage: $currentPage
        lat: $lat,
        lng: $lng,
        roomType: $roomType,
        bedrooms: $bedrooms,
        bathrooms: $bathrooms,
        beds: $beds,
        amenities: $amenities,
        safetyAmenities: $safetyAmenities,
        spaces: $spaces,
        houseRules: $houseRules,
        fish: $fish,
        priceRange: $priceRange,
        geography: $geography,
        bookingType: $bookingType,
        geoType: $geoType,
        searchByMap: $searchByMap,
        facilities: $facilities,
        eat: $eat,
        rent: $rent,
        help: $help
      ){
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
            body: JSON.stringify({ query, variables: valuesFilter }),
            credentials: 'include',
        });
        const response = await resp.json();

        const filteredResults = response.data.SearchListingMap.results.filter(item => item.title && item.listPhotos.length && item.lat && item.lng);

        // Сохраняем данные в кэш
        if (!valuesFilter){
        localStorage.setItem(cacheKey, JSON.stringify(filteredResults));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        }

        return filteredResults;
    }

    handleResize(e) {
        const { showResults } = this.props;
        const isBrowser = typeof window !== 'undefined';
        const smallDevice = isBrowser ? window.matchMedia('(max-width: 768px)').matches : false;
        if (smallDevice) {
            Search.clearMapInstance();
            Search.initYmaps(this);
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
            leftNav = <Button className={cx(s.filterButton, s.locationBtn)} bsStyle="link" onClick={() => {
                const map = document.querySelector(".searchMapSection");
                map.classList.toggle(s.nonactiveMap);
            }}><Material.MdRoom className={s.icon} /></Button>;
            rightNav = <Button className={cx(s.filterButton)} bsStyle="link"
                onClick={() => showForm()}><FormattedMessage {...messages.filters} /><FontAwesome.FaSliders /></Button>;
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


        const { smallDevice, load, visibleMapItems, mapBounds, filter } = this.state;

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
                        !smallDevice && <SearchHeader initialFilter={this.props.initialFilter} searchSettings={searchSettings} filter={filter} setFilters={this.setFilters} mapBounds={mapBounds} />
                    }
                    {
                        smallDevice && !searchMap && <SearchHeader initialFilter={this.props.initialFilter} showFilter={showFilter} showResults={showResults}
                            searchSettings={searchSettings} filter={filter} setFilters={this.setFilters} mapBounds={mapBounds} />
                    }
                    <div className={cx(s.searchResultContainer, { [s.listItemOnly]: isMapShow == false })}>


                        {
                            !smallDevice && DesktopResults && <div className={cx(s.resultsBody)}>
                                <SearchResults
                                    visibleMapItems={visibleMapItems}
                                    isMapShow={isMapShow}
                                    mapBounds={mapBounds}
                                    smallDevice={smallDevice}
                                    initialFilter={initialFilter} />
                            </div>
                        }

                        {
                            smallDevice && searchResults && <div className={cx(s.resultsBody)}>
                                <SearchResults
                                    visibleMapItems={visibleMapItems}
                                    isMapShow={isMapShow}
                                    mapBounds={mapBounds}
                                    smallDevice={smallDevice}
                                    initialFilter={initialFilter} />
                            </div>
                        }

                    </div>

                    {
                        !smallDevice &&
                        <div className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl')}>
                            <div id="map" style={{ height: '100%', width: '100%', display: 'block' }}>

                            </div>
                        </div>
                    }
                    {smallDevice && <div style={{ display: "block" }}
                        className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl', s.nonactiveMap)}>
                        <div id="map" style={{ height: '100%', maxWidth: '700px' }}>
                        </div>
                    </div>}
                    {
                        smallDevice && searchMap &&
                        <div className={cx(s.searchMapContainer, 'searchMapSection searchMapSectionRtl')}>
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

Search = reduxForm({
    form: 'SearchForm', // a unique name for this form
    onSubmit: submit,
    destroyOnUnmount: false,
})(Search);


const selector = formValueSelector('SearchForm');

const mapState = state => ({
    filterToggle: state.toggle.filterToggle,
    mobileSearch: state.mobileSearch.data,
    isMapShow: state.personalized.showMap,
    currentPage: selector(state, 'currentPage'),
    sw_lat: selector(state, 'sw_lat'),
    sw_lng: selector(state, 'sw_lng'),
    ne_lat: selector(state, 'ne_lat'),
    ne_lng: selector(state, 'ne_lng'),
    formValues: getFormValues('SearchForm')(state),
});

const mapDispatch = {
    showMap,
    showResults,
    showForm,
    getListingFields,
    showFilter,
    change,
    submitForm,
};

export default withStyles(s)(connect(mapState, mapDispatch)(Search));
