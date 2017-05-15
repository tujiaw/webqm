import DialogueActionTypes from './dialogue_action_types';
import DialogueDispatcher from '../dispatcher/dialogue_dispatcher';

const DialogueActions = {
  setCurrentId(id) {
    DialogueDispatcher.dispatch({ type: DialogueActionTypes.SET_CURRENT_ID, id });
  },
  addMessage(msg) {
    DialogueDispatcher.dispatch({ type: DialogueActionTypes.ADD_MESSAGE, msg });
  },
};

export default DialogueActions;