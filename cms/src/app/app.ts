import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Contacts } from './contacts/contacts';
import { Header } from './header';

@Component({
  selector: 'cms-root',
  imports: [RouterOutlet, Header, Contacts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cms');
}
