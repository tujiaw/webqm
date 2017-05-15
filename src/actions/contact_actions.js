import ContactActionTypes from './contact_action_types';
import ContactDispatcher from '../dispatcher/contact_dispatcher';

const ContactActions = {
  initContact(contacts) {
    ContactDispatcher.dispatch({ type: ContactActionTypes.INIT_CONTACT, contacts });
  },
  setGroupExpand(groupid, isExpand) {
    ContactDispatcher.dispatch({ type: ContactActionTypes.SET_GROUP_EXPAND, groupid,  isExpand});
  },
};

export default ContactActions;