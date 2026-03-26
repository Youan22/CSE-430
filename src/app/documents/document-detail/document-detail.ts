import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  imports: [NgIf, RouterLink],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css',
})
export class DocumentDetail implements OnInit, OnDestroy {
  document: Document | null = null;

  nativeWindow: any;

  protected subscription = new Subscription();

  constructor(
    protected documentService: DocumentService,
    protected windRefService: WindRefService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.nativeWindow = this.windRefService.getNativeWindow();

    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        const id = params['id'];
        this.document = id ? this.documentService.getDocument(id) : null;
      }),
    );
  }

  onView(): void {
    if (this.document?.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete(): void {
    if (!this.document) {
      return;
    }
    this.documentService.deleteDocument(this.document);
    void this.router.navigate(['/documents']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
