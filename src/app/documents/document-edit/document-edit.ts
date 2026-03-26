import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  imports: [FormsModule, NgIf],
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit, OnDestroy {
  originalDocument: Document | null = null;
  document: Document = new Document('', '', '', '', []);
  editMode = false;

  protected subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        const id = params['id'];
        if (!id) {
          this.editMode = false;
          this.originalDocument = null;
          this.document = new Document('', '', '', '', []);
          return;
        }

        this.originalDocument = this.documentService.getDocument(id);
        if (!this.originalDocument) {
          return;
        }

        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }),
    );
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const value = form.value;
    const newDocument = new Document(
      '',
      value.name,
      value.description || '',
      value.url,
      [],
    );

    if (this.editMode && this.originalDocument) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    void this.router.navigate(['/documents']);
  }

  onCancel(): void {
    void this.router.navigate(['/documents']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
