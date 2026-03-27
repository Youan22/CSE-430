import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'cms-message-item',
  imports: [NgIf],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css',
})
export class MessageItem implements OnInit {
  @Input() message!: Message;

  messageSender: string = '';
  private contactSubscription = new Subscription();

  constructor(protected contactService: ContactService) {}

  ngOnInit(): void {
    this.resolveSenderName();

    // Ensure contacts are loaded when this component is used directly.
    this.contactService.getContacts();
    this.contactSubscription = this.contactService.contactListChangedEvent.subscribe(() => {
      this.resolveSenderName();
    });
  }

  ngOnDestroy(): void {
    this.contactSubscription.unsubscribe();
  }

  private resolveSenderName(): void {
    const sender = (this.message as any).sender;

    // Messages fetched from the backend may already contain populated sender objects.
    if (sender && typeof sender === 'object' && sender.name) {
      this.messageSender = sender.name;
      return;
    }

    // Messages created in the UI may hold sender as contact id string.
    const senderId = typeof sender === 'string' ? sender : '';
    const contact: Contact | null = this.contactService.getContact(senderId);
    this.messageSender = contact ? contact.name : '';
  }
}
