import { Routes } from '@angular/router';
import { MedicationsPageComponent } from './components/medications-page/medications-page.component';

export const routes: Routes = [
  { path: '', component: MedicationsPageComponent },
  { path: '**', redirectTo: '' },
];
