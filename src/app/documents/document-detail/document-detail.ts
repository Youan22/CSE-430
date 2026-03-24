import { Component, Input } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-detail',
  imports: [],
  templateUrl: './document-detail.html',
  styleUrl: './document-detail.css',
})
export class DocumentDetail {
  @Input() document!: Document;
}
