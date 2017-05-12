import Contact from '../view/contact';
import {Container} from 'flux/utils';
import ContactStore from '../store/contact_store';

function getStores() {
  return [
    ContactStore,
  ];
}

function getState() {
  return {
    contacts: ContactStore.getState()
  };
}

export default Container.createFunctional(Contact, getStores, getState);