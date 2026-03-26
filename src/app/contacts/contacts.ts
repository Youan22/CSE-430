import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from './contact.model';
import { ContactService } from './contact.service';
import { ContactDetail } from './contact-detail/contact-detail';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'cms-contacts',
  imports: [NgIf, ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnInit, OnDestroy {
  selectedContact: Contact | null = null;

  protected subscription = new Subscription();

  constructor(protected contactService: ContactService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.contactService.contactSelectedEvent.subscribe(
        (contact: Contact) => (this.selectedContact = contact),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
