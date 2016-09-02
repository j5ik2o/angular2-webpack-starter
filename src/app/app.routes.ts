import { Routes } from '@angular/router';
import { Alert } from './alert';
import { DatePicker } from './datepicker';
import ThreadComponent from './thread/thread.component';


export const ROUTES: Routes = [
  { path: '',      component: ThreadComponent },
  { path: './',      component: ThreadComponent },
  { path: 'date-picker', component: DatePicker }
];
