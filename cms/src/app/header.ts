import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() selectedFeatureEvent = new EventEmitter<string>();

  onSelected(selectedEvent: string): void {
    this.selectedFeatureEvent.emit(selectedEvent);
  }
}
