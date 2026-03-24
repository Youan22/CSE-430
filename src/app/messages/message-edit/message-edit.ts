import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  imports: [],
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  @ViewChild('subject') subjectInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('msgText') msgTextInputRef!: ElementRef<HTMLInputElement>;
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender = 'Rubinel Youanbi';

  onSendMessage(): void {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;
    const newMessage = new Message('6', subject, msgText, this.currentSender);

    this.addMessageEvent.emit(newMessage);
    this.onClear();
  }

  onClear(): void {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
