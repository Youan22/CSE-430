import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactItem } from '../contact-item/contact-item';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  imports: [NgFor, NgIf, FormsModule, ContactItem],
  templateUrl: './contact-edit.html',
  styleUrl: './contact-edit.css',
})
export class ContactEdit implements OnInit, OnDestroy {
  originalContact: Contact | null = null;
  contact: Contact = new Contact('', '', '', '', '', []);
  groupContacts: Contact[] = [];
  editMode = false;
  id = '';

  protected subscription = new Subscription();

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
        if (!this.id) {
          this.editMode = false;
          this.originalContact = null;
          this.contact = new Contact('', '', '', '', '', []);
          this.groupContacts = [];
          return;
        }

        this.originalContact = this.contactService.getContact(this.id);
        if (!this.originalContact) {
          return;
        }

        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact)) as Contact;

        if (this.originalContact.group) {
          this.groupContacts = JSON.parse(
            JSON.stringify(this.originalContact.group),
          ) as Contact[];
        } else {
          this.groupContacts = [];
        }
      }),
    );
  }

  onRemoveItem(index: number): void {
    this.groupContacts.splice(index, 1);
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const value = form.value;
    const newContact = new Contact(
      '',
      value.name,
      value.email,
      value.phone || '',
      value.imageUrl || '',
      this.groupContacts,
    );

    if (this.editMode && this.originalContact) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    void this.router.navigate(['/contacts']);
  }

  onCancel(): void {
    void this.router.navigate(['/contacts']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
