import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  imports: [NgIf],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input() contact!: Contact;
}
