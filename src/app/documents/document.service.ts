import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId = 0;

  documentListChangedEvent = new Subject<Document[]>();

  constructor() {
    // Flatten the hierarchical MOCKDOCUMENTS tree so the UI can show
    // every document (parents + children) in a single list.
    this.documents = this.flattenDocuments(MOCKDOCUMENTS);
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id === id) return document;
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (const document of this.documents) {
      const currentId = parseInt(document.id, 10);
      if (!Number.isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = String(this.maxDocumentId);
    this.documents.push(newDocument);

    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;

    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);

    const documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  private flattenDocuments(documents: any[]): Document[] {
    const result: Document[] = [];

    const visit = (doc: any): void => {
      if (!doc) return;

      result.push({
        id: String(doc.id),
        name: doc.name,
        // Some entries in MOCKDOCUMENTS.ts only provide `name` + `url`.
        // Some entries don't include a description, so fall back to blank.
        description: doc.description ?? '',
        url: doc.url ?? '',
        // The list UI doesn't use nested children yet; keep empty for now.
        children: [],
      } as Document);

      const children = doc.children;
      if (Array.isArray(children)) {
        for (const child of children) visit(child);
      }
    };

    for (const doc of documents) visit(doc);

    return result;
  }
}

