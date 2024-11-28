// Fetch request
import fetch from '../../../core/fetch';

// Redux
import { getSearchResults, loadingSearchResults } from '../../../actions/getSearchResults';

//ymaps
export let submitMapData;
async function submitMap(values, dispatch) {
  // Очистка submitData перед новым запросом
  submitMapData = null;
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
      $ne_lng: Float,
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
        sw_lat: $sw_lat,
        sw_lng: $sw_lng,
        ne_lat: $ne_lat,
        ne_lng: $ne_lng,
        facilities: $facilities,
        eat: $eat,
        rent: $rent,
        help: $help
      ) {
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

  console.log('DAAAAAAA:', values);
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

    if (data && data.SearchListingMap) {
      submitMapData = data.SearchListingMap;
      dispatch(getSearchResults(data.SearchListingMap));
    } else {
      console.warn('SearchListing не вернул результаты.');
      submitMapData = { count: '0', results: [] };
      dispatch(getSearchResults(null));
    }
  } catch (error) {
    console.error('Ошибка выполнения GraphQL запроса:', error);
    submitMapData = { count: '0', results: [] };
    dispatch(getSearchResults(null));
  }
}

export default submitMap;
