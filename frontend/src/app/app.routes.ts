//app.routes.ts

import { Routes } from '@angular/router';
import { SignupComponent } from './features/signup/signup.component';
import { LoginComponent } from './features/login/login.component';
import { AdminLoginComponent } from './features/admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'adminlogin', component: AdminLoginComponent },
  {
    path: 'admindashboard',
    loadChildren: () =>
      import('./core/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'profile',
    loadChildren: () => import('./core/user.routes').then((m) => m.userRoutes),
  },
];
