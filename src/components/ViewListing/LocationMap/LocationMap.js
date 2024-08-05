import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Style
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LocationMap.css';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import cx from 'classnames';
import * as FontAwesome from 'react-icons/lib/fa';
// Redux
import { connect } from 'react-redux';

// Google Places Map Component
// import GoogleMapLoader from "react-google-maps-loader";
import ReactGoogleMapLoader from 'react-google-maps-loader';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
} from 'react-google-maps';

// Constants
import { googleMapAPI } from '../../../config';

// Assets
import mapPinIcon from './map-pin.png';

// Locale
import messages from '../../../locale/messages';

// Redux Actions
import { setStickyBottom } from '../../../actions/Sticky/StrickyActions';
//how_to_get
import {how_to_get} from '../../ViewListing/ListingDetails/ListingDetails.js'
import {formatURL} from "../../../helpers/formatURL";



class LocationMap extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    formatMessage: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      center: {},
      markers: null,
    };
  }


    componentWillMount() {
    const { data } = this.props;
    const lat = data.lat;
    const lng = data.lng;
    this.setState({
      initialCoords: [lat, lng],
      center: {
        lat: Number(lat),
        lng: Number(lng),
      },
      smallDevice: false,
    });
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      let ymapsInitInterval = setInterval(() => {
        if (typeof ymaps != 'object') {
          return false
        } else {
          clearInterval(ymapsInitInterval)
          ymaps.ready(this.initYmaps.bind(this))
          return false
        }
      }, 200)
    }

  }
  static async getMapItems () {
      const cacheKey = 'mapItemsCache';
      const cacheTimeKey = 'mapItemsCacheTime';
      const cacheDuration = 1000 * 60 * 60 * 24* 7;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);

      if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < cacheDuration) {
          console.log('Returning cached data');
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
          body: JSON.stringify({ query }),
          credentials: 'include',
      });

      const response = await resp.json();
      console.log('map results', response, query);

      const filteredResults = response.data.SearchListingMap.results.filter(item => item.title && item.listPhotos.length && item.lat && item.lng);

      localStorage.setItem(cacheKey, JSON.stringify(filteredResults));
      localStorage.setItem(cacheTimeKey, Date.now().toString());

      return filteredResults;
  }

    static async sleep(ms){
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
  async initYmaps() {
      this.map = new ymaps.Map("js-ymap", {
          center: this.state.initialCoords,
          zoom: 12
      });
      let mark = new ymaps.Placemark(this.state.initialCoords, {
          hintContent: 'Точная информация о местоположении предоставляется после подтверждения бронирования',
      });


      const mapItems = await LocationMap.getMapItems();
      let clusterer;
      let geoObjects;
      let getPointOptions;
      let getPointData;
      let points;


      clusterer = new ymaps.Clusterer({
          preset: 'twirl#invertedVioletClusterIcons',
          groupByCoordinates: false,
          clusterDisableClickZoom: true
      })

      clusterer.options.set({
          maxZoom: 30,
          gridSize: 180,
          hasBalloon: false,
          hasHint: false,
          clusterDisableClickZoom: true
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
          LocationMap.map.setBounds(clusterer.getBounds());
      });
      clusterer.events.add(['mouseenter', 'mouseleave'], function (e) {
          var target = e.get('target'),
              eType = e.get('type'),
              zIndex = Number(eType === 'mouseenter') * 1000;
          target.options.set('zIndex', zIndex);
      });
      console.log(clusterer, 'cluster!')
      this.map && this.map.geoObjects.add(clusterer);

      this.map.geoObjects.add(mark);
  }

  render() {
    const { center } = this.state;
    const { data } = this.props;
    const displayName = data.user.profile.displayName;
    const city = data.city;
    const country = data.country;

    return (
      <Row className={cx(s.pageContent)} >
        <div className={cx(s.space2, s.horizontalLineThrough)}>
          <h1 className={cx(s.sectionTitleText, s.space2)}><FormattedMessage {...messages.neighborhood} /></h1>
        </div>
        <div className={cx(s.space2)}>
          <p><span className={cx(s.text)}>{displayName}{' '}{how_to_get}</span></p>
          <div style={{ height: 350 }} id='js-ymap'>

          </div>
          <p className={s.spaceTop1}>
            <span className={cx(s.text)}><FormattedMessage {...messages.neighborhoodInfo} /></span>
          </p>
        </div>
      </Row>
    );
  }
}


const mapState = state => ({

});

const mapDispatch = {
};


export default withStyles(s)(connect(mapState, mapDispatch)(LocationMap));
