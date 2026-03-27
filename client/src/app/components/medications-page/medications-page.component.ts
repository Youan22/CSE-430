import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MedicationFormComponent } from '../medication-form/medication-form.component';
import { MedicationListComponent } from '../medication-list/medication-list.component';
import { MedicationService } from '../../services/medication.service';
import { Medication, MedicationPayload } from '../../models/medication.model';

@Component({
  selector: 'app-medications-page',
  standalone: true,
  imports: [MedicationListComponent, MedicationFormComponent],
  templateUrl: './medications-page.component.html',
  styleUrl: './medications-page.component.css',
})
export class MedicationsPageComponent implements OnInit {
  private readonly medicationsApi = inject(MedicationService);

  medications: Medication[] = [];
  loading = false;
  error: string | null = null;

  showForm = false;
  formMode: 'create' | 'edit' = 'create';
  editingMedication: Medication | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.medicationsApi.getAll().subscribe({
      next: (data) => {
        this.medications = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.httpErrorMessage(err, 'Failed to load medications.');
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    this.formMode = 'create';
    this.editingMedication = null;
    this.showForm = true;
  }

  openEdit(m: Medication): void {
    this.formMode = 'edit';
    this.editingMedication = m;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingMedication = null;
  }

  onSave(payload: MedicationPayload): void {
    this.error = null;
    if (this.formMode === 'create') {
      this.medicationsApi.create(payload).subscribe({
        next: () => {
          this.closeForm();
          this.load();
        },
        error: (err) => {
          this.error = this.httpErrorMessage(err, 'Could not create medication.');
        },
      });
    } else if (this.editingMedication) {
      this.medicationsApi.update(this.editingMedication.id, payload).subscribe({
        next: () => {
          this.closeForm();
          this.load();
        },
        error: (err) => {
          this.error = this.httpErrorMessage(err, 'Could not update medication.');
        },
      });
    }
  }

  onDelete(id: string): void {
    if (!confirm('Delete this medication?')) return;
    this.error = null;
    this.medicationsApi.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error = this.httpErrorMessage(err, 'Could not delete medication.');
      },
    });
  }

  private httpErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse && err.status === 0) {
      return (
        'Cannot reach the API. From the SafeMeds project root run: npm run mean:dev ' +
        '(or two terminals: npm run api and npm run angular). ' +
        'Ensure server/.env has a valid MONGODB_URI (MongoDB Atlas).'
      );
    }
    if (err instanceof HttpErrorResponse && err.error?.message) {
      return err.error.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return fallback;
  }
}
