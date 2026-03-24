import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true,
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  constructor(private elRef: ElementRef<HTMLElement>) {}

  @HostListener('click')
  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: Event): void {
    const target = event.target as Node;
    if (!this.elRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }
}
