import { Component, ElementRef, ViewChild } from '@angular/core';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  imports: [],
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  @ViewChild('subject') subjectInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('msgText') msgTextInputRef!: ElementRef<HTMLInputElement>;

  // `Message.sender` is expected to store a Contact `id`, not the Contact name.
  // Use an id that exists in MOCKCONTACTS.ts (the mock messages use '7').
  currentSender = '7';

  constructor(protected messageService: MessageService) {}

  onSendMessage(): void {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;
    const newId = String(this.messageService.getMessages().length + 1);
    const newMessage = new Message(newId, subject, msgText, this.currentSender);

    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear(): void {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
