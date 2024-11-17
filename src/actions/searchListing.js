import { gql } from 'react-apollo';
import { reset, change } from 'redux-form';
import { hideLoading } from 'react-redux-loading-bar';

import {
  SEARCH_LISTING_START,
  SEARCH_LISTING_SUCCESS,
  SEARCH_LISTING_ERROR,
} from '../constants';

import { getSearchResults, loadingSearchResults } from './getSearchResults';


const query = gql`
  query(
      $personCapacity: Int,
      $dates: String,
      $currentPage: Int,
      $geography: String,
      $geoType: String,
      $lat: Float,
      $lng: Float,
      $distance: Int,
      $sw_lat: Float, 
      $sw_lng: Float, 
      $ne_lat: Float, 
      $ne_lng: Float,
      $location: String,
      $amenities: [Int],
      $safetyAmenities: [Int],
    ){
      SearchListing(
        personCapacity: $personCapacity,
        dates: $dates,
        currentPage: $currentPage,
        geography: $geography,
        geoType: $geoType,
        lat: $lat,
        lng: $lng,
        distance: $distance,
        sw_lat: $sw_lat, 
        sw_lng: $sw_lng, 
        ne_lat: $ne_lat, 
        ne_lng: $ne_lng,
        location: $location,
        amenities: $amenities,
        safetyAmenities: $safetyAmenities
      ) {
        count
        results {
          id
          title
          personCapacity
          lat
          lng
          beds
          bookingType
          coverPhoto
          reviewsCount,
          reviewsStarRating,
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
          settingsData {
            listsettings {
              id
              itemName
              itemDescription
            }
          }
          wishListStatus
          isListOwner
        }
      }
    }
`;

export function searchListing({ personCapacity, dates, geography, currentPage, geoType, lat, lng, distance, sw_lat, sw_lng, ne_lat, ne_lng, location, amenities, safetyAmenities }) {
  return async (dispatch, getState, { client }) => {
    dispatch(loadingSearchResults())
    dispatch({ type: SEARCH_LISTING_START });
    dispatch(reset('SearchForm'));
    console.log('coordinates', lat, lng);
    console.log('coordinatesMap', sw_lat, sw_lng, ne_lat, ne_lng);


    try {
      const { data } = await client.query({
        query,
        variables: {
          personCapacity,
          dates,
          currentPage,
          geography,
          geoType,
          lat,
          lng,
          distance,
          sw_lat,
          sw_lng,
          ne_lat,
          ne_lng,
          location,
          amenities,
          safetyAmenities
        },
        fetchPolicy: 'network-only',
      });
      if (data.SearchListing) {
        dispatch({ type: SEARCH_LISTING_SUCCESS });
        await dispatch(change('SearchForm', 'personCapacity', personCapacity));
        await dispatch(change('SearchForm', 'amenities', amenities));
        await dispatch(change('SearchForm', 'dates', dates));
        await dispatch(change('SearchForm', 'geography', geography));
        await dispatch(change('SearchForm', 'currentPage', currentPage));
        await dispatch(change('SearchForm', 'geoType', geoType));
        await dispatch(change('SearchForm', 'lat', lat));
        await dispatch(change('SearchForm', 'lng', lng));

        // await dispatch(change('SearchForm', 'searchByMap', true));

        await dispatch(change('SearchForm', 'sw_lat', sw_lat));
        await dispatch(change('SearchForm', 'sw_lng', sw_lng));
        await dispatch(change('SearchForm', 'ne_lat', ne_lat));
        await dispatch(change('SearchForm', 'ne_lng', ne_lng));
        await dispatch(change('SearchForm', 'initialLoad', true));
        await dispatch(change('SearchForm', 'markerHighlight', {}));
        // Default Map Show
        await dispatch(change('SearchForm', 'showMap', true));
        dispatch(getSearchResults(data.SearchListing));
        dispatch(hideLoading());
      }
    } catch (error) {
      dispatch({
        type: SEARCH_LISTING_ERROR,
        payload: {
          error,
        },
      });
      dispatch(hideLoading());
      return false;
    }

    return true;
  };
}
