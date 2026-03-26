import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  imports: [NgIf, RouterLink],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css',
})
export class ContactDetail implements OnInit, OnDestroy {
  contact: Contact | null = null;

  protected subscription = new Subscription();

  constructor(
    protected contactService: ContactService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        const id = paramMap.get('id');
        this.contact = id ? this.contactService.getContact(id) : null;
      }),
    );
  }

  onDelete(): void {
    if (!this.contact) {
      return;
    }
    this.contactService.deleteContact(this.contact);
    void this.router.navigateByUrl('/contacts');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
