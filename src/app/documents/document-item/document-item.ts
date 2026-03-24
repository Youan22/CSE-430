import { Component, Input } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-item',
  imports: [],
  templateUrl: './document-item.html',
  styleUrl: './document-item.css',
})
export class DocumentItem {
  @Input() document!: Document;
}
