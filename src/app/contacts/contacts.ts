import { Component } from '@angular/core';

import { ContactDetail } from './contact-detail/contact-detail';
import { ContactList } from './contact-list/contact-list';

@Component({
  selector: 'cms-contacts',
  imports: [ContactList, ContactDetail],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts {

}
