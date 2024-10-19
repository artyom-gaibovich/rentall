import { reset } from 'redux-form';

// Redux Action
import { contactHostClose } from '../../../actions/message/contactHostModal';
import { contactHost } from '../../../actions/message/contactHost';


async function submit(values, dispatch) {
  dispatch(contactHostClose());
  try {
    ym(92387837, 'reachGoal', 'question_ok');
    console.log('reachGoal', 'question_ok');
  } catch (e) {
    console.log('e', e);
  }
  const listId = values.listId;
  const host = values.host;
  const content = values.content;
  const startDate = values.startDate;
  const endDate = values.endDate;
  const personCapacity = values.personCapacity;
  const status = 1;
  const rent = 0;
  const transfer = 0;
  const nutrition = 0;
  const huntsman = 0;
  const assistant = 0;
  const addition = '';
  dispatch(contactHost(
    listId,
    host,
    content,
    startDate,
    endDate,
    personCapacity,
    status,
    rent,
    transfer,
    nutrition,
    huntsman,
    assistant,
    addition,
    values.hostEmail,
    values.firstName,
  ));
  dispatch(reset('ContactHostForm'));
}

export default submit;
