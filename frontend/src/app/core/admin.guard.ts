// auth/admin.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    const admin = JSON.parse(sessionStorage.getItem('adminSession') || 'null');
    if (admin && admin.role?.toLowerCase() === 'admin') {
      return true;
    }

    this.router.navigate(['/adminlogin']); // redirect to login
    return false;
  }
}
