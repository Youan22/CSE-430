import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { DropdownDirective } from './directives/dropdown.directive';

@Component({
  selector: 'cms-header',
  imports: [DropdownDirective, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
}
