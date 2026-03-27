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

  private documentsUrl = 'http://localhost:3000/documents';

  constructor(protected http: HttpClient) {
    // Flatten the hierarchical MOCKDOCUMENTS tree so the UI can show
    // every document (parents + children) in a single list.
    this.documents = this.flattenDocuments(MOCKDOCUMENTS);
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    this.http
      .get<{ message: string; documents: Document[] }>(this.documentsUrl)
      .subscribe(
        // success method
        (responseData: { message: string; documents: Document[] }) => {
          this.documents = responseData.documents ?? [];
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

  addDocument(newDocument: Document): void {
    if (!newDocument) {
      return;
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    newDocument.id = '';

    this.http
      .post<{ message: string; document: Document }>(this.documentsUrl, newDocument, {
        headers,
      })
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    (newDocument as any)._id = (originalDocument as any)._id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(`${this.documentsUrl}/${originalDocument.id}`, newDocument, { headers })
      .subscribe(() => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }
    const pos = this.documents.findIndex((d) => d.id === document.id);
    if (pos < 0) {
      return;
    }
    this.http.delete(`${this.documentsUrl}/${document.id}`).subscribe(() => {
      this.documents.splice(pos, 1);
      this.sortAndSend();
    });
  }

  private sortAndSend(): void {
    this.documents.sort((a: Document, b: Document) => a.name.localeCompare(b.name));
    this.maxDocumentId = this.getMaxId();
    this.documentListChangedEvent.next(this.documents.slice());
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

