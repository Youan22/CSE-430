import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Medication, MedicationPayload } from '../models/medication.model';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/medications`;

  getAll(): Observable<Medication[]> {
    return this.http.get<Medication[]>(this.base);
  }

  getById(id: string): Observable<Medication> {
    return this.http.get<Medication>(`${this.base}/${id}`);
  }

  create(body: MedicationPayload): Observable<Medication> {
    return this.http.post<Medication>(this.base, body);
  }

  update(id: string, body: MedicationPayload): Observable<Medication> {
    return this.http.put<Medication>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
