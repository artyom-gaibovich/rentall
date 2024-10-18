import GetAddressComponentsType from '../types/GetAddressComponentsType';

import {
  GraphQLString as StringType,
} from 'graphql';

import fetch from '../../core/fetch';

// Constants
import { googleMapServerAPI, yandexMapServerAPI } from '../../config';

const GetAddressComponents = {

  type: GetAddressComponentsType,

  args: {
    address: { type: StringType },
  },

  async resolve({ request }, { address }) {
    // Yandex API

    const URL = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yandexMapServerAPI}&geocode=${encodeURI(address)}`;
    const resp = await fetch(URL);
    const data = await resp.json();
    if (data) {
      const locationData = {};
      let addressComponents;

      const geoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject;
      const envelope = geoObject.boundedBy.Envelope;
      const [sw_lng, sw_lat] = envelope.lowerCorner.split(' ');
      const [ne_lng, ne_lat] = envelope.upperCorner.split(' ');
      const [lng, lat] = geoObject.Point.pos.split(' ');
      const geoType = geoObject.metaDataProperty.GeocoderMetaData.kind;

      geoObject.metaDataProperty.GeocoderMetaData.Address.Components.map((item, key) => {
        locationData[item.kind] = item.name;
      });

      addressComponents = JSON.stringify(locationData);

      return {
        addressComponents,
        lat,
        lng,
        geoType,
        sw_lat,
        sw_lng,
        ne_lat,
        ne_lng,
      };
    }

    // Google API

    // const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${googleMapServerAPI}`;
    // const resp = await fetch(URL);
    // const data = await resp.json();

    // const locationData = {};
    // let addressComponents;
    // let types = [],
    //   geoType,
    //   viewport;
    // let sw_lat,
    //   sw_lng,
    //   ne_lat,
    //   ne_lng;

    // if (data) {
    //   data.results.map((value, key) => {
    //     viewport = value.geometry.viewport;
    //     types = value.types;
    //     sw_lat = viewport.southwest.lat;
    //     sw_lng = viewport.southwest.lng;
    //     ne_lat = viewport.northeast.lat;
    //     ne_lng = viewport.northeast.lng;

    //     value.address_components.map((item, key) => {
    //       if (item.types[0] == 'administrative_area_level_1') {
    //         locationData.administrative_area_level_1_short = item.short_name;
    //         locationData.administrative_area_level_1_long = item.long_name;
    //       } else if (item.types[0] == 'country') {
    //         locationData[item.types[0]] = item.short_name;
    //       } else {
    //         locationData[item.types[0]] = item.long_name;
    //       }
    //     });
    //   });

    //   if (types) {
    //     if (types.indexOf('country') > -1) {
    //       geoType = 'country';
    //     } else if (types.indexOf('administrative_area_level_1') > -1) {
    //       geoType = 'state';
    //     } else if (types.indexOf('street_address') > -1 || types.indexOf('route') > -1) {
    //       geoType = 'street';
    //     } else {
    //       geoType = null;
    //     }
    //   }

    //   addressComponents = JSON.stringify(locationData);

    //   return {
    //     addressComponents,
    //     lat: data.results[0].geometry.location.lat,
    //     lng: data.results[0].geometry.location.lng,
    //     geoType,
    //     sw_lat,
    //     sw_lng,
    //     ne_lat,
    //     ne_lng,
    //   };
    // }
  },
};

export default GetAddressComponents;
