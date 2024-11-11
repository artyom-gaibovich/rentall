// Fetch request
import fetch from '../../../core/fetch';

// Redux
import { getSearchResults, loadingSearchResults } from '../../../actions/getSearchResults';

//ymaps
export let submitData;
async function submit(values, dispatch) {
  // Очистка submitData перед новым запросом
  submitData = null;
  dispatch(loadingSearchResults());
  const query =
    `query(
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
      $sw_lat: Float,
      $sw_lng: Float,
      $ne_lat: Float,
      $ne_lng: Float
    ){
      SearchListing(
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
        sw_lat: $sw_lat,
        sw_lng: $sw_lng,
        ne_lat: $ne_lat,
        ne_lng: $ne_lng
      ) {
        count
        results {
          id
          title
          personCapacity
          lat
          lng
          beds
          coverPhoto
          bookingType
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

  console.log('Запрос с параметрами values:', values);
  try {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: values }),
      credentials: 'include',
    });

    const { data } = await resp.json();
    console.log('Полученные данные:', data);

    if (data && data.SearchListing) {
      submitData = data.SearchListing;
      dispatch(getSearchResults(data.SearchListing));
    } else {
      console.warn('SearchListing не вернул результаты.');
      submitData = { count: '0', results: [] };
      dispatch(getSearchResults(null));
    }
  } catch (error) {
    console.error('Ошибка выполнения GraphQL запроса:', error);
    submitData = { count: '0', results: [] };
    dispatch(getSearchResults(null));
  }
}

export default submit;
