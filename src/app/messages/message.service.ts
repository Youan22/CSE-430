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

  // Example:
  // `https://<your-db>.firebaseio.com/messages.json?auth=<token>`
  private messagesUrl =
    'https://cms-app-project-88573-default-rtdb.firebaseio.com/messages.json?auth=YOUR_FIREBASE_AUTH_TOKEN';

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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .get<Message[]>(this.messagesUrl, { headers })
      .subscribe(
        (messages: Message[]) => {
          // Firebase could return null if there are no messages yet.
          this.messages = messages ?? [];
          this.maxMessageId = this.getMaxId();

          this.messageChangedEvent.emit(this.messages.slice());
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

  storeMessages(): void {
    const jsonMessages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.messagesUrl, jsonMessages, { headers })
      .subscribe(() => {
        this.messageChangedEvent.emit(this.messages.slice());
      });
  }

  addMessage(message: Message): void {
    if (!message) {
      return;
    }

    this.maxMessageId++;
    message.id = String(this.maxMessageId);
    this.messages.push(message);

    this.storeMessages();
  }
}

