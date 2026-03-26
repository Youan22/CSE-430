import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { DocumentItem } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  imports: [NgFor, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList implements OnInit {
  documents: Document[] = [];

  constructor(protected documentService: DocumentService) {}

  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
  }

  onSelectedDocument(document: Document): void {
    this.documentService.documentSelectedEvent.emit(document);
  }
}
