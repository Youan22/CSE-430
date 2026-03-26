import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ContactItem } from '../contact-item/contact-item';

@Component({
  selector: 'cms-contact-list',
  imports: [NgFor, ContactItem],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {
  contacts: Contact[] = [];

  constructor(protected contactService: ContactService) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
  }

  onSelected(contact: Contact): void {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
