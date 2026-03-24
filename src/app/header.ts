import { Component, EventEmitter, Output } from '@angular/core';

import { DropdownDirective } from './directives/dropdown.directive';

@Component({
  selector: 'cms-header',
  imports: [DropdownDirective],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() selectedFeatureEvent = new EventEmitter<string>();

  onSelected(selectedEvent: string): void {
    this.selectedFeatureEvent.emit(selectedEvent);
  }
}
