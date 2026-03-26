import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // TODO: Replace with your Firebase Realtime Database REST endpoint.
  // Example: `https://<your-db>.firebaseio.com/documents.json?auth=<token>`
  private documentsUrl =
    'https://cms-app-project-88573-default-rtdb.firebaseio.com/documents.json?auth=YOUR_FIREBASE_AUTH_TOKEN';

  constructor(protected http: HttpClient) {
    // Flatten the hierarchical MOCKDOCUMENTS tree so the UI can show
    // every document (parents + children) in a single list.
    this.documents = this.flattenDocuments(MOCKDOCUMENTS);
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .get<Document[]>(this.documentsUrl, { headers })
      .subscribe(
        // success method
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();

          // Sort by name (ascending).
          this.documents.sort((a: Document, b: Document) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });

          this.documentListChangedEvent.next(this.documents.slice());
        },
        // error method
        (error: any) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
      );

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

  storeDocuments(): void {
    // Sort so the list is stable in the UI and in the database.
    this.documents.sort((a: Document, b: Document) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    const jsonDocuments = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.documentsUrl, jsonDocuments, { headers })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = String(this.maxDocumentId);
    this.documents.push(newDocument);

    this.storeDocuments();
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

    this.storeDocuments();
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

    this.storeDocuments();
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

