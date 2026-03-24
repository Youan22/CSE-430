import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { Document } from '../document.model';
import { DocumentItem } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  imports: [NgFor, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      '1',
      'CIT 260 - Object Oriented Programming',
      'Object-oriented design and programming concepts.',
      'https://example.com/cit260',
      [],
    ),
    new Document(
      '2',
      'CIT 366 - Full Web Stack Development',
      'Full-stack web application development.',
      'https://example.com/cit366',
      [],
    ),
    new Document(
      '3',
      'CIT 425 - Data Warehousing',
      'Data warehousing principles and practice.',
      'https://example.com/cit425',
      [],
    ),
    new Document(
      '4',
      'CIT 460 - Enterprise Development',
      'Enterprise software architecture and development.',
      'https://example.com/cit460',
      [],
    ),
    new Document(
      '5',
      'CIT 495 - Senior Practicum',
      'Capstone practicum experience.',
      'https://example.com/cit495',
      [],
    ),
  ];

  onSelectedDocument(document: Document): void {
    this.selectedDocumentEvent.emit(document);
  }
}
