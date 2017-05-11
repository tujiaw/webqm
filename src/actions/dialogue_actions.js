import DialogueActionTypes from './dialogue_action_types';
import DialogueDispatcher from '../dispatcher/dialogue_dispatcher';

const DialogueActions = {
  addMessage(msg) {
    DialogueDispatcher.dispatch({
      type: DialogueActionTypes.ADD_MESSAGE,
      msg,
    });
  },
};

export default DialogueActions;