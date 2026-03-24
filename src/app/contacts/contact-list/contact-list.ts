import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { Contact } from '../contact.model';
import { ContactItem } from '../contact-item/contact-item';

@Component({
  selector: 'cms-contact-list',
  imports: [NgFor, ContactItem],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [
    new Contact(
      '1',
      'R. Kent Jackson',
      'jacksonk@byui.edu',
      '208-496-3771',
      '/assets/images/jacksonk.jpg',
      null,
    ),
    new Contact(
      '2',
      'Rex Barzee',
      'barzeer@byui.edu',
      '208-496-3768',
      '/assets/images/barzeer.jpg',
      null,
    ),
  ];

  onSelected(contact: Contact): void {
    this.selectedContactEvent.emit(contact);
  }
}
