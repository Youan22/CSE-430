import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Frequency,
  Medication,
  MedicationPayload,
} from '../../models/medication.model';

@Component({
  selector: 'app-medication-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './medication-form.component.html',
  styleUrl: './medication-form.component.css',
})
export class MedicationFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) mode: 'create' | 'edit' = 'create';
  @Input() medication: Medication | null = null;

  @Output() readonly cancel = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<MedicationPayload>();

  readonly frequencies: { value: Frequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'as_needed', label: 'As needed' },
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    dosage: ['', Validators.required],
    frequency: this.fb.nonNullable.control<Frequency>('daily'),
    instructions: [''],
    startDate: ['', Validators.required],
    endDate: [''],
    notes: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['medication'] && !changes['mode']) {
      return;
    }
    if (this.mode === 'edit' && this.medication) {
      this.form.patchValue({
        name: this.medication.name,
        dosage: this.medication.dosage,
        frequency: this.medication.frequency,
        instructions: this.medication.instructions,
        startDate: this.medication.startDate.slice(0, 10),
        endDate: this.medication.endDate?.slice(0, 10) ?? '',
        notes: this.medication.notes ?? '',
      });
      return;
    }
    if (this.mode === 'create') {
      this.form.reset({
        name: '',
        dosage: '',
        frequency: 'daily',
        instructions: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: '',
        notes: '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: MedicationPayload = {
      name: v.name,
      dosage: v.dosage,
      frequency: v.frequency,
      instructions: v.instructions,
      startDate: v.startDate,
      endDate: v.endDate || undefined,
      notes: v.notes || undefined,
      reminders: this.medication?.reminders ?? [],
      doseHistory: this.medication?.doseHistory ?? [],
    };
    this.save.emit(payload);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
