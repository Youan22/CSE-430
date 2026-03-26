import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DocumentDetail } from './document-detail/document-detail';
import { DocumentList } from './document-list/document-list';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  imports: [NgIf, DocumentList, DocumentDetail],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit, OnDestroy {
  selectedDocument: Document | null = null;

  protected subscription = new Subscription();

  constructor(protected documentService: DocumentService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.documentService.documentSelectedEvent.subscribe(
        (document: Document) => (this.selectedDocument = document),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
