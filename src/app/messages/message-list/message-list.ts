import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { MessageEdit } from '../message-edit/message-edit';
import { MessageItem } from '../message-item/message-item';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  imports: [NgFor, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit {
  messages: Message[] = [];

  protected subscription = new Subscription();

  constructor(protected messageService: MessageService) {}

  ngOnInit(): void {
    this.messages = this.messageService.getMessages();
    this.subscription.add(
      this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
        this.messages = messages;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
