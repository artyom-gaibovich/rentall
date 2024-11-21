import React from 'react';
import FooterLessLayout from '../../components/Layout/FooterLessLayout';
import Search from './Search';
import fetch from '../../core/fetch';

import { searchListing } from '../../actions/searchListing';
import { setPersonalizedValues } from '../../actions/personalized';

import { showLoading, hideLoading } from 'react-redux-loading-bar';
import moment from 'moment';

const title = 'Search';

export default {

  path: '/s',

  async action({ params, store, query }) {
    store.dispatch(showLoading());

    // Fetch Search Settings
    const searchQuery = `
      {
        getSearchSettings {
          minPrice
          maxPrice
          priceRangeCurrency
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
        query: searchQuery,
      }),
      credentials: 'include',
    });

    const { data } = await resp.json();


    // From Redux Store
    const geographyData = store.getState().personalized.geography;
    const personCapacityData = store.getState().personalized.personCapacity;
    const amenitiesData = store.getState().personalized.amenities;
    const facilitiesData = store.getState().personalized.facilities;
    const startDateData = store.getState().personalized.startDate;
    const endDateData = store.getState().personalized.endDate;
    let geoType = store.getState().personalized.geoType;
    let lat = store.getState().personalized.lat;
    let lng = store.getState().personalized.lng;
    const distance = store.getState().personalized.distance;
    let sw_lat = store.getState().personalized.sw_lat;
    let sw_lng = store.getState().personalized.sw_lng;
    let ne_lat = store.getState().personalized.ne_lat;
    let ne_lng = store.getState().personalized.ne_lng;
    let personCapacity,
      dates,
      geography,
      facilities,
      currentPage = 1,
      location;
    const initialFilter = {};

    let amenities;


    if ('address' in query && encodeURI(query.address)) {
      const latAndLngQuery = `
            query ($address: String) {
              GetAddressComponents (address:$address) {
                addressComponents
                lat
                lng
                geoType
                sw_lat 
                sw_lng 
                ne_lat 
                ne_lng
              }
            }
          `;
      const locationResp = await fetch('/graphql', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: latAndLngQuery,
          variables: { address: query.address },
        }),
        credentials: 'include',
      });

      const { data } = await locationResp.json();
      if (data && data.GetAddressComponents) {
        initialFilter.address = query.address;
        initialFilter.geography = data.GetAddressComponents.addressComponents;
        initialFilter.lat = data.GetAddressComponents.lat;
        initialFilter.lng = data.GetAddressComponents.lng;
        initialFilter.sw_lat = data.GetAddressComponents.sw_lat;
        initialFilter.sw_lng = data.GetAddressComponents.sw_lng;
        initialFilter.ne_lat = data.GetAddressComponents.ne_lat;
        initialFilter.ne_lng = data.GetAddressComponents.ne_lng;
        geography = data.GetAddressComponents.addressComponents;
        geoType = data.GetAddressComponents.geoType;
        lat = data.GetAddressComponents.lat;
        lng = data.GetAddressComponents.lng;
        sw_lat = data.GetAddressComponents.sw_lat,
          sw_lng = data.GetAddressComponents.sw_lng,
          ne_lat = data.GetAddressComponents.ne_lat,
          ne_lng = data.GetAddressComponents.ne_lng;
        location = query.address;
        store.dispatch(setPersonalizedValues({ name: 'location', value: query.address }));
      }
    } else {
      lat = null;
      lng = null;
    }

    if (distance > 0) {
      const ipData = await fetch('https://tdirect.msk.ru/ip').then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Не удалось получить текущее местоположение! Unable to get current location!');
      })
        .then(responseJson => responseJson)
        .catch((error) => {
          // console.log(error);
        });
      lat = ipData.lat;
      lng = ipData.lon;
    }
    // }

    // PersonCapacity
    if (personCapacityData != undefined && personCapacityData != null) {
      personCapacity = personCapacityData;
    } else if ('guests' in query && query.guests) {
      initialFilter.personCapacity = Number(query.guests);
      personCapacity = Number(query.guests);
    }

    // Custom filters
    if (amenitiesData != undefined && amenitiesData != null) {
      amenities = amenitiesData;
    } else if ('amenities' in query && query.amenities) {
      const amenitiesArray = query.amenities.split(',').map(Number);
      initialFilter.amenities = amenitiesArray;
      amenities = amenitiesArray;
    }
    let safetyAmenities = []
    if ('safetyAmenities' in query && query.safetyAmenities) {
       console.log('QUERY!df', query)
      const amenitiesArray = query.safetyAmenities.split(',').map(Number);
      initialFilter.safetyAmenities = amenitiesArray;
      safetyAmenities = amenitiesArray;
    }

    if (facilitiesData != undefined && facilitiesData != null) {
      facilities = facilitiesData;
    }

    if (startDateData != undefined && startDateData != null && endDateData != undefined && endDateData != null) {
      dates = `'${startDateData}' AND '${endDateData}'`;
    } else {
      const today = moment(new Date()).format('YYYY-MM-DD');
      const startDate = moment(query.startdate).format('YYYY-MM-DD');
      const endDate = moment(query.enddate).format('YYYY-MM-DD');
      let checkValidDate = false;
      if ((startDate < today) || endDate < today) {
        checkValidDate = true;
      } else if (startDate == endDate) {
        checkValidDate = true;
      } else if (startDate > endDate) {
        checkValidDate = true;
      } else if ((moment(startDate).isValid() == false) || (moment(endDate).isValid() == false)) {
        checkValidDate = true;
      }

      if (checkValidDate) {
        query.startdate = '';
        query.enddate = '';
      }

      if ('startdate' in query && 'enddate' in query && query.startdate && query.enddate) {
        initialFilter.startDate = query.startdate;
        initialFilter.endDate = query.enddate;
        dates = `'${query.startdate}' AND '${query.enddate}'`;
        store.dispatch(setPersonalizedValues({ name: 'startDate', value: query.startdate }));
        store.dispatch(setPersonalizedValues({ name: 'endDate', value: query.enddate }));
      }
    }
    // Default Map Show
    store.dispatch(setPersonalizedValues({ name: 'showMap', value: true }));

    await store.dispatch(searchListing({ personCapacity, dates, geography, currentPage, geoType, lat, lng, distance, sw_lat, sw_lng, ne_lat, ne_lng, location, amenities, safetyAmenities }));

    
    return {
      title,
      component: <FooterLessLayout page={'search'}><Search
        initialFilter={initialFilter}
        searchSettings={data.getSearchSettings}
      />
      </FooterLessLayout>,
    };
  },

};
