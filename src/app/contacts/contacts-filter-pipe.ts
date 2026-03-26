import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
})
export class ContactsFilterPipe implements PipeTransform {
  transform(
    contacts: Contact[] | null | undefined | Record<string, Contact>,
    term: string | null | undefined,
  ): Contact[] {
    const list = this.toContactArray(contacts);
    const t = (term ?? '').trim().toLowerCase();

    // Whitespace-only counts as “no search” (avoids hiding most contacts).
    if (t.length < 1) {
      return list.slice();
    }

    const filteredContacts = list.filter((contact: Contact) => {
      const name = (contact?.name ?? '').toLowerCase();
      return name.includes(t);
    });

    if (filteredContacts.length < 1) {
      return list.slice();
    }

    return filteredContacts.slice();
  }

  private toContactArray(
    contacts: Contact[] | null | undefined | Record<string, Contact>,
  ): Contact[] {
    if (contacts == null) {
      return [];
    }
    if (Array.isArray(contacts)) {
      return contacts;
    }
    // Firebase can return map-shaped JSON instead of a true array.
    if (typeof contacts === 'object') {
      return Object.values(contacts) as Contact[];
    }
    return [];
  }
}
