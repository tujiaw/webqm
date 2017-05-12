import DialogueActionTypes from './dialogue_action_types';
import DialogueDispatcher from '../dispatcher/dialogue_dispatcher';

const DialogueActions = {
  setCurrentId(id) {
    DialogueDispatcher.dispatch({ type: DialogueActionTypes.SET_CURRENT_ID, id });
  },
  addMessage(id, msg) {
    DialogueDispatcher.dispatch({ type: DialogueActionTypes.ADD_MESSAGE, id, msg });
  },
};

export default DialogueActions;