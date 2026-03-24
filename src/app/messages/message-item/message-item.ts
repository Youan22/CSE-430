import { Component, Input } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  imports: [],
  templateUrl: './message-item.html',
  styleUrl: './message-item.css',
})
export class MessageItem {
  @Input() message!: Message;
}
