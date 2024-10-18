import LocationItemType from '../types/LocationItemType';

import {
  GraphQLString as StringType,
} from 'graphql';

import fetch from '../../core/fetch';

// Constants
import { googleMapServerAPI, yandexMapServerAPI } from '../../config';

const locationItem = {

  type: LocationItemType,

  args: {
    address: { type: StringType },
  },

  async resolve({ request }, { address }) {

    // Yandex API

    const URL = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${yandexMapServerAPI}&geocode=${encodeURI(address)}`
    const resp = await fetch(URL);
    const data = await resp.json();
    if (data) {
      const locationData = {};
      
      const geoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject;      
      const [lng, lat] =  geoObject.Point.pos.split(' ');
      
      geoObject.metaDataProperty.GeocoderMetaData.Address.Components.map((item, key) => {  
        locationData[item.kind] = item.name;
      });

      return {
        street: locationData.house || locationData.route,
        country: locationData.country,
        city: locationData.locality,
        state: locationData.province,
        zipcode: geoObject.metaDataProperty.GeocoderMetaData.Address.postal_code,
        lat,
        lng,
        status: 200,
      };
    }
    return {
      status: 400,
    };
    
    // Google API 
    
    // const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${googleMapServerAPI}`;
    // const resp = await fetch(URL);
    // const data = await resp.json();
    // const locationData = {};
    // if (data && data.results && data.results.length > 0) {
    //   data.results.map((item, key) => {
    //     item.address_components.map((value, key) => {
    //       if (value.types[0] == 'administrative_area_level_1' || value.types[0] == 'country') {
    //         locationData[value.types[0]] = value.short_name;
    //       } else {
    //         locationData[value.types[0]] = value.long_name;
    //       }
    //     });
    //   });
    //   const city = locationData.administrative_area_level_2 != undefined ? locationData.administrative_area_level_2 : locationData.locality;
    //   const streetNumber = locationData.street_number != undefined ? `${locationData.street_number} ${locationData.route}` : locationData.route;

    //   return {
    //     street: streetNumber,
    //     country: locationData.country,
    //     city,
    //     state: locationData.administrative_area_level_1,
    //     zipcode: locationData.postal_code,
    //     lat: data.results[0].geometry.location.lat,
    //     lng: data.results[0].geometry.location.lng,
    //     status: 200,
    //   };
    // }
    // return {
    //   status: 400,
    // };
  },
};

export default locationItem;
