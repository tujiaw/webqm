import Contact from '../view/contact';
import {Container} from 'flux/utils';
import ContactStore from '../store/contact_store';
import UsersStore from '../store/users_store';
import CompanyStore from '../store/company_store';

function getStores() {
  return [
    ContactStore,
    UsersStore,
    CompanyStore
  ];
}

function getState() {
  return {
    contacts: ContactStore.getState(),
    users: UsersStore.getState(),
    companies: CompanyStore.getState(),
  };
}

export default Container.createFunctional(Contact, getStores, getState);