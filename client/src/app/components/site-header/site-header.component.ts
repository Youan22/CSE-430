import { Component } from '@angular/core';

@Component({
  selector: 'app-site-header',
  standalone: true,
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
})
export class SiteHeaderComponent {
  readonly title = 'SafeMeds';
  readonly tagline = 'Keep your medication list clear and up to date.';
}
