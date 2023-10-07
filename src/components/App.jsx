import { Component } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  //   Filter contacts

  filterContacts = evt => {
    this.setState({
      filter: evt.currentTarget.value.trim(),
    });
  };
  getFilteredContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  //   Submit form

  handleSubmit = data => {
    const isInContacts = this.state.contacts.find(
      ({ name }) => name.toLowerCase() === data.name.toLowerCase()
    );

    if (isInContacts) {
      Notiflix.Notify.failure(`${data.name} is already in contacts!`, {
        position: 'left-top',
        distance: '10px',
      });
      return;
    }
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.concat({
          id: nanoid(),
          name: data.name,
          number: data.number,
        }),
      };
    });
  };

  //   Delete contacts

  deleteContact = idOfContact => {
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(({ id }) => id !== idOfContact),
      };
    });
  };
  render() {
    return (
      <div className="container">
        <h1 className="formTitle">Phonebook</h1>
        <ContactForm onSubmit={this.handleSubmit} />

        <h2 className="contactsTitle">Contacts</h2>
        <Filter value={this.state.filter} onChange={this.filterContacts} />
        {this.state.contacts.length !== 0 && (
          <ContactList
            onClick={this.deleteContact}
            contacts={this.getFilteredContacts()}
          />
        )}
      </div>
    );
  }
}
