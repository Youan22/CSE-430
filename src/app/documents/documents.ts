import { Component } from '@angular/core';

import { DocumentDetail } from './document-detail/document-detail';
import { DocumentList } from './document-list/document-list';

@Component({
  selector: 'cms-documents',
  imports: [DocumentList, DocumentDetail],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents {

}
