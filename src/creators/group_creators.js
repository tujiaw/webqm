import Actions from '../actions/actions';
import ContactStore from '../store/contact_store';

const GroupCreators = {
  isGroupExpand: function(groupid) {
    const groups = ContactStore.getState();
    const res = groups.findEntry(group => group.ID === groupid);
    if (res !== undefined && res.length > 1) {
      if (res[1].isExpand !== undefined) {
        return res[1].isExpand;
      }
    }
    return false;
  },
  setGroupExpand: function(groupid, isExpand) {
    Actions.contact.setGroupExpand(groupid, isExpand);
  }
}

export default GroupCreators;