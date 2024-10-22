import { gql } from 'react-apollo';

import {
  CONTACT_HOST_START,
  CONTACT_HOST_SUCCESS,
  CONTACT_HOST_ERROR,
} from '../../constants';

export function contactHost(
  listId,
  host,
  content,
  startDate,
  endDate,
  personCapacity,
  status = 0,
  rent,
  transfer,
  nutrition,
  huntsman,
  assistant,
  addition,
  hostEmail,
  firstName,
) {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: CONTACT_HOST_START,
    });

    try {
      console.log(rent, transfer, nutrition, huntsman, assistant, addition);
      const account = getState().account.data;

      const type = status ? 'chat' : 'inquiry';

      const mutation = gql`
          mutation CreateThreadItems(
            $listId: Int!, 
            $host: String!,
            $content: String!,
            $type: String,
            $startDate: String,
            $endDate: String,
            $personCapacity: Int,
            $rent: Int,
            $transfer: Int,
            $nutrition: Int,
            $huntsman: Int,
            $assistant: Int,
            $addition: String,
          ){
              CreateThreadItems(
                listId: $listId,
                host: $host,
                content: $content,
                type: $type,
                startDate: $startDate,
                endDate: $endDate,
                personCapacity: $personCapacity,
                rent: $rent,
                transfer: $transfer,
                nutrition: $nutrition,
                huntsman: $huntsman,
                assistant: $assistant,
                addition: $addition,
              ) {
                  id
                  threadId
                  sentBy
                  content
                  type
                  startDate
                  endDate
                  personCapacity
                  createdAt
                  rent
                  transfer
                  nutrition
                  huntsman
                  assistant
                  addition
              }
          }
      `;

      // Send Message
      const { data } = await client.mutate({
        mutation,
        variables: {
          listId,
          host,
          content,
          type,
          startDate,
          endDate,
          personCapacity,
          rent,
          transfer,
          nutrition,
          huntsman,
          assistant,
          addition,
        },
      });

      if (data && data.CreateThreadItems) {
        dispatch({
          type: CONTACT_HOST_SUCCESS,
        });
      }
    } catch (error) {
      dispatch({
        type: CONTACT_HOST_ERROR,
        payload: {
          error,
        },
      });
      console.log(`error: ${error}`);
      return false;
    }

    return true;
  };
}
