import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactDetail } from './contacts/contact-detail/contact-detail';
import { ContactEdit } from './contacts/contact-edit/contact-edit';
import { Contacts } from './contacts/contacts';
import { DocumentDetail } from './documents/document-detail/document-detail';
import { DocumentEdit } from './documents/document-edit/document-edit';
import { Documents } from './documents/documents';
import { MessageList } from './messages/message-list/message-list';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
  {
    path: 'documents',
    component: Documents,
    children: [
      { path: 'new', component: DocumentEdit },
      { path: ':id/edit', component: DocumentEdit },
      { path: ':id', component: DocumentDetail },
    ],
  },
  { path: 'messages', component: MessageList },
  {
    path: 'contacts',
    component: Contacts,
    children: [
      { path: 'new', component: ContactEdit },
      { path: ':id/edit', component: ContactEdit },
      { path: ':id', component: ContactDetail },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
