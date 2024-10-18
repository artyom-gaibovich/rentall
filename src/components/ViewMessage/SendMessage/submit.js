// Redux Form
import { reset } from 'redux-form';

// Redux action
import { sendMessageAction } from '../../../actions/message/sendMessageAction';

async function submit(values, dispatch) {
  const threadId = values.threadId;
  const threadType = values.threadType;
  const type = values.type;
  const content = values.content;
  dispatch(sendMessageAction(
		threadId,
		threadType,
		content,
		type,
		undefined,
		undefined,
		0,
		undefined,
		values.receiverName,
		values.senderName,
		values.receiverType,
		values.receiverEmail,
	));
  dispatch(reset('SendMessage'));
}

export default submit;
