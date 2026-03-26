import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  imports: [],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css',
})
export class MessageItem implements OnInit {
  @Input() message!: Message;

  messageSender: string = '';

  constructor(protected contactService: ContactService) {}

  ngOnInit(): void {
    const contact = this.contactService.getContact(this.message.sender);
    this.messageSender = contact ? contact.name : '';
  }
}
