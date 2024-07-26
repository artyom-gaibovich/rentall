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
const GoogleMapPlace =
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={14}
      center={props.center}
      defaultOptions={{
        backgroundColor: '',
        scrollwheel: false,
        maxZoom: 16,
        minZoom: 11,
        streetViewControl: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        mapTypeControl: false,
      }}
    >
      <Circle
        center={props.center}
        radius={800}
        options={{
          fillColor: '#00d1c1',
          strokeColor: '#007A87',
        }}
      />
      {/* <Marker
      position={props.markers.position}
      draggable={false}
      icon={{
        url: mapPinIcon
      }}
    /> */}
    </GoogleMap>
  ));


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
          // console.log('ymaps not defined, wait and try again')
          return false
        } else {
          // console.log('ymaps inited searchResults')
  
         
          clearInterval(ymapsInitInterval)
          ymaps.ready(this.initYmaps.bind(this))
          // this.setState({
          //   load: true,
          // });
          // // console.log(searchResultsData)
          // console.log('ymaps init end')
  
          return false
        }
      }, 200)
    }
    
    // this.handleResize = this.handleResize.bind(this);
  }
  initYmaps () {
		this.map = new ymaps.Map("js-ymap", {
      center: this.state.initialCoords,
      zoom: 12
    });
    let mark = new ymaps.Placemark(this.state.initialCoords, { 
      hintContent: 'Точная информация о местоположении предоставляется после подтверждения бронирования', 
      // balloonContent: 'Где-то тут' 
  });

  this.map.geoObjects.add(mark);
	}
  render() {
    const { center } = this.state;
    const { data } = this.props;
    // console.log(how_to_get)
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
            {/* <ReactGoogleMapLoader
              params={{
                key: googleMapAPI, // Define your api key here
                libraries: 'places,geometry', // To request multiple libraries, separate them with a comma
              }}
              render={googleMaps =>
                googleMaps && (
                  <GoogleMapPlace
                    containerElement={
                      <div style={{ width: '100%', height: '100%' }} />
                    }
                    mapElement={
                      <div style={{ width: '100%', height: '100%' }} />
                    }
                    center={center}
                    markers={{
                      position: new google.maps.LatLng(center.lat, center.lng),
                    }}
                  />
                )}
            /> */}
          </div>
          <p className={s.spaceTop1}>
            <span className={cx(s.text)}><FormattedMessage {...messages.neighborhoodInfo} /></span>
          </p>
        </div>
      </Row>
    );
  }
}

// export default withStyles(s)(LocationMap);

const mapState = state => ({

});

const mapDispatch = {
  // setStickyBottom
};

// export default GoogleMapLoader(withStyles(s)(connect(mapState, mapDispatch)(LocationMap)), {
//   libraries: ["places", "geometry"],
//   region: "US",
//   language: "en",
//   key: googleMapAPI,
// });

export default withStyles(s)(connect(mapState, mapDispatch)(LocationMap));
