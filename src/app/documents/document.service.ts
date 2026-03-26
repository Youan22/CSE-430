import { EventEmitter, Injectable } from '@angular/core';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();

  constructor() {
    // Flatten the hierarchical MOCKDOCUMENTS tree so the UI can show
    // every document (parents + children) in a single list.
    this.documents = this.flattenDocuments(MOCKDOCUMENTS);
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

