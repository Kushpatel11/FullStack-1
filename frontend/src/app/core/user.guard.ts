// auth/user.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('userSession') || 'null');
    if (user && user.role === 'user') {
      return true;
    }

    this.router.navigate(['/login']); // redirect to login
    return false;
  }
}
