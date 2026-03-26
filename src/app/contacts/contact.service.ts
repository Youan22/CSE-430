import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  maxContactId = 0;

  contactListChangedEvent = new Subject<Contact[]>();

  // Example:
  // `https://cms-app-project-88573-default-rtdb.firebaseio.com/contacts.json?auth=<token>`
  private contactsUrl =
    'https://cms-app-project-88573-default-rtdb.firebaseio.com/contacts.json?auth=YOUR_FIREBASE_AUTH_TOKEN';

  constructor(protected http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .get<Contact[]>(this.contactsUrl, { headers })
      .subscribe(
        (contacts: Contact[] | Record<string, Contact> | null) => {
          this.contacts = this.normalizeContactList(contacts);
          this.maxContactId = this.getMaxId();

          this.contacts.sort((a: Contact, b: Contact) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });

          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
      );

    return this.contacts.slice();
  }

  private normalizeContactList(
    data: Contact[] | Record<string, Contact> | null | undefined,
  ): Contact[] {
    if (data == null) {
      return [];
    }
    if (Array.isArray(data)) {
      return data;
    }
    return Object.values(data);
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) return contact;
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (!Number.isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  storeContacts(): void {
    this.contacts.sort((a: Contact, b: Contact) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    const jsonContacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.contactsUrl, jsonContacts, { headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = String(this.maxContactId);
    this.contacts.push(newContact);

    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;

    this.storeContacts();
  }

  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);

    this.storeContacts();
  }
}

