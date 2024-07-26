import { reset } from 'redux-form';

// Redux Action
import { contactHostClose } from '../../../actions/message/contactHostModal';
import { contactHost } from '../../../actions/message/contactHost';


async function submit(values, dispatch) {
  dispatch(contactHostClose());
  try {
    ym(92387837,'reachGoal','question_ok')
    console.log('reachGoal','question_ok')
  } catch (e) {
    console.log('e', e)
  }
  const listId = values.listId;
  const host = values.host;
  const content = values.content;
  const startDate = values.startDate;
  const endDate = values.endDate;
  const personCapacity = values.personCapacity;
  dispatch(contactHost(
    listId,
    host,
    content,
    startDate,
    endDate,
    personCapacity,
    values.hostEmail,
    values.firstName,
  ));
  dispatch(reset('ContactHostForm'));
}

export default submit;
