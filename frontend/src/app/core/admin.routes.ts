//admin.routes.ts

import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '../features/admindashboard/admindashboard.component';
import { AdminGuard } from './admin.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
  },
];
