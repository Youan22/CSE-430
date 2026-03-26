import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './header';

@Component({
  selector: 'cms-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
