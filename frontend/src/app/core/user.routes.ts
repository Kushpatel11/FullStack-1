import { Routes } from '@angular/router';
import { UserGuard } from './user.guard';
import { UserProfileComponent } from '../features/userprofile/userprofile.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    canActivate: [UserGuard],
  },
];
