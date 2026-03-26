import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  imports: [NgIf, RouterLink, RouterLinkActive],
  templateUrl: './contact-item.html',
  styleUrl: './contact-item.css',
})
export class ContactItem {
  @Input() contact!: Contact;
}
