export type Frequency = 'daily' | 'weekly' | 'monthly' | 'as_needed';

export interface ReminderTime {
  id: string;
  hour: number;
  minute: number;
  enabled: boolean;
}

export interface DoseRecord {
  id: string;
  timestamp: string;
  taken: boolean;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: Frequency;
  instructions: string;
  startDate: string;
  endDate?: string;
  reminders: ReminderTime[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  doseHistory: DoseRecord[];
}

/** Body sent to the API for create/update */
export type MedicationPayload = Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>;
