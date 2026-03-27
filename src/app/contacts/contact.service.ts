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

  private contactsUrl = 'http://localhost:3000/contacts';

  constructor(protected http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    this.http
      .get<{ message: string; contacts: Contact[] }>(this.contactsUrl)
      .subscribe(
        (responseData: { message: string; contacts: Contact[] }) => {
          this.contacts = this.normalizeContactList(responseData.contacts);
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

  addContact(newContact: Contact): void {
    if (!newContact) {
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    newContact.id = '';

    this.http
      .post<{ message: string; contact: Contact }>(this.contactsUrl, newContact, {
        headers,
      })
      .subscribe((responseData) => {
        this.contacts.push(responseData.contact);
        this.sortAndSend();
      });
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    (newContact as any)._id = (originalContact as any)._id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(`${this.contactsUrl}/${originalContact.id}`, newContact, { headers })
      .subscribe(() => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      });
  }

  deleteContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    const pos = this.contacts.findIndex((c) => c.id === contact.id);
    if (pos < 0) {
      return;
    }
    this.http.delete(`${this.contactsUrl}/${contact.id}`).subscribe(() => {
      this.contacts.splice(pos, 1);
      this.sortAndSend();
    });
  }

  private sortAndSend(): void {
    this.contacts.sort((a: Contact, b: Contact) => a.name.localeCompare(b.name));
    this.maxContactId = this.getMaxId();
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}

