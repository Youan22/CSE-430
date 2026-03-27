import { SlicePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [SlicePipe],
  templateUrl: './medication-list.component.html',
  styleUrl: './medication-list.component.css',
})
export class MedicationListComponent {
  @Input({ required: true }) medications: Medication[] = [];

  @Output() readonly add = new EventEmitter<void>();
  @Output() readonly edit = new EventEmitter<Medication>();
  @Output() readonly deleteId = new EventEmitter<string>();

  /** Show dosage with mg when the user entered a plain number (e.g. "100" → "100 mg"). */
  formatDosage(dosage: string | number | null | undefined): string {
    const s = String(dosage ?? '').trim();
    if (!s) return s;
    if (/mg\b/i.test(s)) return s;
    return `${s} mg`;
  }
}
