import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter } from '@angular/core';

import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId = 0;

  private messagesUrl = 'http://localhost:3000/messages';

  constructor(protected http: HttpClient) {}

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);
      if (!Number.isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getMessages(): Message[] {
    this.http
      .get<{ message: string; messages: Message[] }>(this.messagesUrl)
      .subscribe(
        (responseData: { message: string; messages: Message[] }) => {
          this.messages = responseData.messages ?? [];
          this.sortAndSend();
        },
        (error: any) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
      );

    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) return message;
    }
    return null;
  }

  addMessage(message: Message): void {
    if (!message) {
      return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    message.id = '';

    this.http
      .post<{ message: string; messageObject: Message }>(this.messagesUrl, message, {
        headers,
      })
      .subscribe((responseData) => {
        this.messages.push(responseData.messageObject);
        this.sortAndSend();
      });
  }

  private sortAndSend(): void {
    this.messages.sort((a: Message, b: Message) => a.subject.localeCompare(b.subject));
    this.maxMessageId = this.getMaxId();
    this.messageChangedEvent.emit(this.messages.slice());
  }
}

