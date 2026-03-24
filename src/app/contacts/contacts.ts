import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { Contact } from './contact.model';
import { ContactDetail } from './contact-detail/contact-detail';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'cms-contacts',
  imports: [NgIf, ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {
  selectedContact: Contact | null = null;
}
