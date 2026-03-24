import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

import { Message } from '../message.model';
import { MessageEdit } from '../message-edit/message-edit';
import { MessageItem } from '../message-item/message-item';

@Component({
  selector: 'cms-message-list',
  imports: [NgFor, MessageItem, MessageEdit],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList {
  messages: Message[] = [
    new Message('1', 'Grades', 'The grades for this assignment have been posted', 'Bro. Jackson'),
    new Message('2', 'Due Date', 'When is assignment 3 due', 'Steve Johnson'),
    new Message('3', 'Assignment 3', 'Assignment 3 is due on Saturday at 11:30 PM', 'Bro. Jackson'),
    new Message('4', 'Help', 'Can I meet with you sometime. I need help with assignment 3', 'Mark Smith'),
    new Message('5', 'Meeting', 'I can meet with you today at 4:00 PM in my office.', 'Bro. Jackson'),
  ];

  onAddMessage(message: Message): void {
    this.messages.push(message);
  }
}
