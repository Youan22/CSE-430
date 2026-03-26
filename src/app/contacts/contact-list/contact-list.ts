import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ContactItem } from '../contact-item/contact-item';

@Component({
  selector: 'cms-contact-list',
  imports: [NgFor, RouterLink, ContactItem],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit, OnDestroy {
  contacts: Contact[] = [];

  protected subscription = new Subscription();

  constructor(protected contactService: ContactService) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.subscription.add(
      this.contactService.contactListChangedEvent.subscribe(
        (contacts: Contact[]) => (this.contacts = contacts),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
