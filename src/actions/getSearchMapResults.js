import {
  LOADING_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_START,
  FETCH_SEARCH_RESULTS_SUCCESS,
  FETCH_SEARCH_RESULTS_ERROR,
} from '../constants';

export let searchResultsData;
export function getSearchResults(data) {
  return async (dispatch, getState, { client }) => {
     
    dispatch({
      type: FETCH_SEARCH_RESULTS_START,
    });

    try {
      if (data) {
        // Dispatch a success action
        dispatch({
          type: FETCH_SEARCH_RESULTS_SUCCESS,
          payload: {
            data,
            isResultLoading: false,
          },
        });
      } else {
        dispatch({
          type: FETCH_SEARCH_RESULTS_ERROR,
          payload: {
            isResultLoading: false,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_SEARCH_RESULTS_ERROR,
        payload: {
          error,
          isResultLoading: false,
        },
      });
      return false;
    }

    searchResultsData = data;
    return true;
  };
}
export function loadingSearchResults() {
  return (dispatch) => {
    dispatch({
      type: LOADING_SEARCH_RESULTS,
      payload: {
        isResultLoading: true,
      },
    });
  };
}
