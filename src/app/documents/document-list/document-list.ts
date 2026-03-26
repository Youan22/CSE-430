import { NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { DocumentItem } from '../document-item/document-item';

@Component({
  selector: 'cms-document-list',
  imports: [NgFor, RouterLink, DocumentItem],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
})
export class DocumentList implements OnInit, OnDestroy {
  documents: Document[] = [];

  protected subscription = new Subscription();

  constructor(protected documentService: DocumentService) {}

  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
    this.subscription.add(
      this.documentService.documentListChangedEvent.subscribe(
        (documents: Document[]) => (this.documents = documents),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
